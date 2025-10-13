# Agents Guidelines

## Overview
- **Goal**: Standardize how we build LangGraph/LangChain-based agents.
- **Key parts**: Graphs, State, Nodes, Tools, LLMs, Streaming, Context, API.
- **References**:
  - `agents/aggregate/agent.py` – Orchestrator for compiled graphs, streaming, resume, state fetch.
  - `agents/api/conversation.py` – FastAPI endpoints + rate limiting + context injection.
  - `agents/plan/application/*` – Example task agent (planning + itinerary).
  - `agents/shared/*` – Infra: LLMs, runtime context, data stream protocol, utils.

## Directory structure
- **`agents/aggregate/agent.py`**: Builds/compiles graphs, streams with `DataStream*Part`, converts messages for UI, supports `response()`, `stream_response()`, `resume()`, `get_conversation()`.
- **`agents/api/`**: HTTP interface (e.g., `conversation.py`).
- **`agents/chat/`**: Chat agent graph, nodes, tools, prompts, tests.
- **`agents/plan/`**: Plan agent graph, nodes, tools, prompts, constraints, state.
- **`agents/shared/`**: Shared infra (LLMs, runtime/context, data stream, db pool, utils like Google Maps).

## Core Concepts
- **Graph**: Build with `StateGraph` and compile. Cache builders with `@lru_cache`.
  - Example: `agents/plan/application/graph.py` defines `plan_graph()` and `plan_agent`.
- **State**: Extend `AgentState` for agent-specific fields.
  - Example: `PlanAgentState` (`agents/plan/application/state.py`) adds `plan`, `itinerary`, `language`, `context`.
- **Nodes**: Async functions operating on state; can call services/tools and return state deltas.
  - Example: `create_itinerary_node()`, `get_attractions_node()` in `agents/plan/application/nodes.py`.
- **Tools**: Encapsulate side effects or cross-graph transitions.
  - Example: `transfer_to_chat_tool` used in `transfer_to_chat_node()`.
- **Prompts/Constraints**: Keep prompt templates in `domain/prompt.py` and node IDs in `domain/constraints.py`.
- **LLMs**: Centralized in `agents/shared/infrastructure/llm.py` (e.g., `llm`, `planning_llm`).

## Graph design guidelines
- **State schema**: Define a pydantic model extending `AgentState` with minimal, necessary fields.
- **Nodes**:
  - Signature patterns:
    - `async def node(state: MyState, config: RunnableConfig)`
    - `async def node(state: MyState, runtime: Runtime[ContextSchema], config: RunnableConfig)` when external services are needed.
  - Return partial state deltas (dict) and `ToolMessage`s when you are answering a tool call.
  - Prefer structured outputs via `JsonOutputParser` or `.with_structured_output`.
- **Edges**: Keep edges explicit and readable. Use constants from `constraints.py` for node IDs.
- **Compilation**: Use a checkpointer.
  - Dev: `MemorySaver()`.
  - Prod: `AsyncPostgresSaver` with `AsyncConnectionPool` (see commented example in `aggregate/agent.py`).

## Streaming protocol
- **Text streaming**: `Agent.stream_response()` emits:
  - `DataStreamMessageStartPart` → `DataStreamTextStartPart` → repeated `DataStreamTextDeltaPart` → `DataStreamTextEndPart` → `DataStreamFinishPart` → `[DONE]`.
- **Custom data streaming**:
  - Nodes publish via `get_stream_writer()`.
  - Example: `create_itinerary_node()` emits chunks under key `"data-itinerary"` with metadata `{langgraph_node: "create_itinerary_node"}`.
  - Aggregator forwards as `DataStreamDataPart("itinerary", data)` in `_async_stream()`.

## Context passing & external services
- **Injection**: API provides context per request.
  - `agents/api/conversation.py`: `context = {"googlemaps_api": request.app.state.googlemaps_api}`.
  - Graphs receive via `ContextSchema` and `runtime.context` (see `get_attractions_node()`).
- **External APIs**: Wrap in `agents/shared/utils/`.
  - Example: `GoogleMapsAPI.search_attractions()` manages session, headers, timeouts, errors.

## Error handling & logging
- **In nodes**: Catch/log and return safe fallbacks.
  - Example: `get_attractions_node()` logs and returns `{ "context": {"attractions": []} }` on failure.
- **Aggregate/API**:
  - `aggregate/agent.py` logs errors, raises `RuntimeError`.
  - `api/conversation.py` wraps in `HTTPException` with 500 and logs via `loguru`.
- **Rate limiting**: Use `@limiter.limit` decorators on public endpoints.

## Coding conventions
- **Separation**: `application/` (graphs/nodes/tools/state), `domain/` (prompts/constraints), `shared/` (infra), `api/` (HTTP layer).
- **Prompts**: Store in `domain/prompt.py`, use `.partial()` to inject dynamic vars (`language`, `format_instructions`, etc.).
- **LLM**: Stream when possible, set reasonable `max_tokens` and `temperature`.
- **Caching**: Cache graph builders with `@lru_cache(maxsize=1)`.
- **Typing**: Use pydantic models for inputs/outputs; keep state and tool I/O typed.

## Add a new agent (checklist)
1. Create `application/state.py` extending `AgentState`.
2. Implement nodes in `application/nodes.py` (async, structured outputs, safe error handling).
3. Add tools in `application/tools.py` if needed.
4. Define prompts/constraints in `domain/`.
5. Build graph in `application/graph.py` with nodes/edges, `ContextSchema`.
6. Compile graph and expose a handle (e.g., `my_agent = my_graph().compile()`).
7. Wire into `agents/aggregate/agent.py` (select graph, forward custom data if any).
8. Expose endpoints in `agents/api/`.
9. Add tests mirroring `agents/chat/tests/` patterns.

## Write a node (pattern)
```python
async def my_node(state: MyAgentState, runtime: Runtime[ContextSchema], config: RunnableConfig):
    last_msg = state["messages"][-1]
    tool_call_id = last_msg.tool_calls[0]["id"] if last_msg.tool_calls else None

    # LLM with structured output
    parser = JsonOutputParser(pydantic_object=MyOutputModel)
    chain = prompt | llm | parser
    result = await chain.ainvoke({"input": ...}, config=config)

    # Optional: stream custom data
    get_stream_writer()({"data-key": {"data": result, "metadata": {"langgraph_node": "my_node"}}})

    delta = {"my_field": result}
    messages = []
    if tool_call_id:
        messages.append(ToolMessage(content="Done", tool_call_id=tool_call_id))
    return {**delta, "messages": messages}
```

## API integration
- Endpoints: `POST /v1/conversation/response`, `POST /v1/conversation/stream`, `GET /v1/conversation/{session_id}`.
- RunnableConfig: set `thread_id`, `user_id` via `config["configurable"]`.
- Persistence: use DB checkpointer in production to support resume/history.

## Testing
- Unit-test nodes with mocked `runtime.context`.
- Contract-test streaming parts (`DataStream*Part`) and custom data forwarding.
- Keep prompt/parse tests similar to `agents/chat/tests/`.

## Performance & reliability
- Cache graph builders. Avoid rebuilding LLM clients per call.
- Batch external requests; handle timeouts and retries where appropriate.
- Validate inputs/outputs strictly with pydantic models.
