from typing import Annotated, Literal
from datetime import datetime

from langchain_core.messages import ToolMessage, SystemMessage
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import InjectedToolCallId, tool
from langchain_core.output_parsers import PydanticOutputParser
from langgraph.prebuilt import InjectedState
from langgraph.types import Command

from agents.shared.infrastructure.llm import llm, planning_llm
from agents.shared.models import HotelSearchCriteria, Plan, MultiHotelSearchCriteria


def _filter_conversation_messages(messages: list[BaseMessage]) -> list[BaseMessage]:
    filtered: list[BaseMessage] = []
    for m in messages:
        if isinstance(m, HumanMessage):
            filtered.append(m)
        elif isinstance(m, AIMessage) and not m.tool_calls and m.content:
            filtered.append(m)
    return filtered


def _validate_search_criteria(criteria: HotelSearchCriteria) -> list[str]:
    errors: list[str] = []
    if not criteria.destination or not criteria.destination.strip():
        errors.append("destination is required")
    if not criteria.check_in:
        errors.append("check_in is required")
    if not criteria.check_out:
        errors.append("check_out is required")
    if (
        criteria.check_in
        and criteria.check_out
        and criteria.check_in >= criteria.check_out
    ):
        errors.append("check_out must be after check_in")
    if criteria.adults is None or criteria.adults < 1:
        errors.append("adults must be at least 1")
    if criteria.children is not None and criteria.children < 0:
        errors.append("children cannot be negative")
    if criteria.rooms is None or criteria.rooms < 1:
        errors.append("rooms must be at least 1")
    if criteria.min_price is not None and criteria.min_price < 0:
        errors.append("min_price cannot be negative")
    if criteria.max_price is not None and criteria.max_price < 0:
        errors.append("max_price cannot be negative")
    if (
        criteria.min_price is not None
        and criteria.max_price is not None
        and criteria.min_price > criteria.max_price
    ):
        errors.append("min_price cannot be greater than max_price")
    if criteria.min_rating is not None and (
        criteria.min_rating < 0 or criteria.min_rating > 10
    ):
        errors.append("min_rating must be between 0 and 10")
    return errors


@tool
def transfer_to_chatbot(
    state: Annotated[dict, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command[Literal["chatbot"]]:
    """Transfer control back to the chatbot with hotel recommendations or validation guidance."""

    def _build_no_results_message() -> str:
        lang = state.get("language", "vi")
        criteria = state.get("search_criteria")
        if lang.lower().startswith("vi"):
            if criteria:
                return (
                    f"Không tìm thấy khách sạn phù hợp tại {criteria.destination} cho khoảng thời gian đã chọn. "
                    "Bạn có muốn nới ngân sách, bớt yêu cầu tiện ích, hoặc tăng khoảng cách tới trung tâm/đổi ngày không?"
                )
            return "Không tìm thấy khách sạn phù hợp. Bạn có muốn nới ngân sách, bớt tiện ích, tăng khoảng cách, hoặc đổi ngày không?"
        if criteria:
            return (
                f"No matching hotels found in {criteria.destination} for the selected dates. "
                "Would you like to relax budget, reduce required amenities, increase distance to center, or adjust dates?"
            )
        return "No matching hotels found. Consider relaxing budget, reducing amenities, increasing distance, or adjusting dates."

    def _needs_no_results_message() -> bool:
        rec = state.get("hotel_recommendation")
        if rec and hasattr(rec, "recommended_hotels"):
            return len(rec.recommended_hotels) == 0
        if state.get("context", {}).get("multi"):
            multi = state.get("multi_hotel_recommendation")
            if multi and hasattr(multi, "segments"):
                return all(
                    len(seg.recommendation.recommended_hotels) == 0
                    for seg in multi.segments
                )
        return False

    content = (
        _build_no_results_message()
        if _needs_no_results_message()
        else "Transfer to Chatbot. Hotel recommendations ready"
    )

    return Command(
        goto="chatbot",
        update={
            "hotel_recommendation": state.get("hotel_recommendation"),
            "multi_hotel_recommendation": state.get("multi_hotel_recommendation"),
            "messages": state["messages"]
            + [
                ToolMessage(
                    content=content,
                    tool_call_id=tool_call_id,
                )
            ],
        },
        graph=Command.PARENT,
    )


@tool
async def recommend_hotels(
    language: str,
    state: Annotated[dict, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command[Literal["hotel_agent", "chat_node"]]:
    """
    Extract hotel search criteria from summary and messages then transfer to Hotel Agent to search and recommend hotels.
    """
    parser = PydanticOutputParser(pydantic_object=HotelSearchCriteria)

    plan_context = ""
    if state.get("plan"):
        plan: Plan = state["plan"]
        plan_context = f"""
Previous trip plan (you can reuse this information if user doesn't specify again):
- Destinations: {", ".join(plan.destinations)}
- Travel dates: {plan.time_interval.from_date} to {plan.time_interval.to_date}
- Budget: {plan.budget.min_value}-{plan.budget.max_value} {plan.budget.currency.value}
- Preferences: {plan.user_preferences or "Not specified"}

**IMPORTANT**: User may want different budget for hotel (usually smaller than total trip budget). 
If user doesn't mention hotel budget, you can use the trip budget as reference but adjust reasonably.
If user asks for hotels without specifying details, reuse the above information intelligently.
"""

    current_date = datetime.now().strftime("%Y-%m-%d")
    current_year = datetime.now().year

    system_prompt = """Extract hotel search criteria from the user's conversation.
**PAY ATTENTION** to destination, dates, budget range, number of guests, and any special requirements.
Convert dates to YYYY-MM-DD format if needed.

{plan_context}
{format_instructions}
Return ONLY a valid JSON object. Do not wrap in code fences or tags.
\n**DO NOT** add any explanation or additional text.
\nResponse in {language} language.
\nCurrent date is {current_date}. Please consider this when extracting dates, you can assume the year is {current_year} or next year if date has passed.
\nSummary of the conversation so far (if any):\n{summary}"""
    system_prompt = system_prompt.format(
        format_instructions=parser.get_format_instructions(),
        language=language,
        summary=state.get("summary", ""),
        plan_context=plan_context,
        current_date=current_date,
        current_year=current_year,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=system_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    chain = prompt | planning_llm | parser

    conv_messages = _filter_conversation_messages(state["messages"])
    search_criteria: HotelSearchCriteria = await chain.ainvoke(
        {"messages": conv_messages}
    )

    errors = _validate_search_criteria(search_criteria)
    if errors:
        content = (
            "Thông tin tìm khách sạn chưa đầy đủ/không hợp lệ: "
            + "; ".join(errors)
            + ". Vui lòng cung cấp lại (điểm đến, ngày nhận/trả phòng, số khách, số phòng)."
        )
        return Command(
            goto="chat_node",
            update={
                "messages": state["messages"]
                + [
                    ToolMessage(
                        content=content,
                        tool_call_id=tool_call_id,
                    )
                ]
            },
            graph=Command.PARENT,
        )

    return Command(
        goto="hotel_agent",
        update={
            "search_criteria": search_criteria,
            "language": language,
            "messages": state["messages"]
            + [
                ToolMessage(
                    content="Transfer to Hotel Agent", tool_call_id=tool_call_id
                )
            ],
        },
        graph=Command.PARENT,
    )


@tool
async def recommend_hotels_multi(
    language: str,
    state: Annotated[dict, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command[Literal["hotel_agent", "chat_node"]]:
    """
    Extract multiple hotel search segments from the conversation and transfer to Hotel Agent.
    """
    parser = PydanticOutputParser(pydantic_object=MultiHotelSearchCriteria)

    current_date = datetime.now().strftime("%Y-%m-%d")
    current_year = datetime.now().year

    system_prompt = """Extract multiple hotel search segments from the user's conversation.
{format_instructions}
Return ONLY a valid JSON object. Do not wrap in code fences or tags.
\n**DO NOT** add any explanation or additional text.
\nResponse in {language} language.
\nCurrent date is {current_date}. Please consider this when extracting dates, you can assume the year is {current_year} or next year if date has passed.
\nSummary of the conversation so far (if any):\n{summary}"""
    system_prompt = system_prompt.format(
        format_instructions=parser.get_format_instructions(),
        language=language,
        summary=state.get("summary", ""),
        current_date=current_date,
        current_year=current_year,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=system_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    chain = prompt | planning_llm | parser

    conv_messages = _filter_conversation_messages(state["messages"])
    multi_criteria: MultiHotelSearchCriteria = await chain.ainvoke(
        {"messages": conv_messages}
    )

    invalid_segments: list[str] = []
    for idx, seg in enumerate(multi_criteria.segments, start=1):
        seg_errors = _validate_search_criteria(seg)
        if seg_errors:
            invalid_segments.append(f"Segment {idx}: " + "; ".join(seg_errors))

    if invalid_segments:
        content = (
            "Một số phân đoạn tìm khách sạn không hợp lệ: "
            + " | ".join(invalid_segments)
            + ". Vui lòng bổ sung hoặc chỉnh sửa."
        )
        return Command(
            goto="chat_node",
            update={
                "messages": state["messages"]
                + [
                    ToolMessage(
                        content=content,
                        tool_call_id=tool_call_id,
                    )
                ]
            },
            graph=Command.PARENT,
        )

    return Command(
        goto="hotel_agent",
        update={
            "multi_search_criteria": multi_criteria,
            "language": language,
            "messages": state["messages"]
            + [
                ToolMessage(
                    content="Transfer to Hotel Agent (multi-destination)",
                    tool_call_id=tool_call_id,
                )
            ],
        },
        graph=Command.PARENT,
    )
