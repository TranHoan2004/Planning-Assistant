from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableConfig
from langchain_core.prompts import ChatPromptTemplate
from langgraph.config import get_stream_writer

from agents.shared.state import AgentState
from agents.shared.infrastructure.llm import planning_llm
from agents.shared.models import ItineraryResponse
from agents.plan.domain.prompt import CREATE_ITINERARY_TEMPLATE


async def create_itinerary_node(state: AgentState, config: RunnableConfig):
    """Create detailed itinerary based on plan."""
    parser = JsonOutputParser(pydantic_object=ItineraryResponse)
    stream_writer = get_stream_writer()

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", CREATE_ITINERARY_TEMPLATE),
            ("human", "Plan: {plan}"),
        ]
    ).partial(
        language=state["language"], format_instructions=parser.get_format_instructions()
    )

    chain = prompt | planning_llm | parser

    response = {}
    async for chunk in chain.astream(
        {
            "plan": state["plan"].model_dump_json(),
        },
        config=config,
    ):
        stream_writer(
            {
                "data-itinerary": {
                    "data": chunk,
                    "metadata": {"langgraph_node": "create_itinerary_node"},
                }
            }
        )
        response.update(chunk)

    return {"itinerary": ItineraryResponse(**response)}
