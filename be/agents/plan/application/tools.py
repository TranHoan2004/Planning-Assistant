from agents.shared.utils import create_handoff_tool


transfer_to_plan_agent = create_handoff_tool(
    agent_name="plan_agent",
    description="Transfer to Plan Agent",
)
