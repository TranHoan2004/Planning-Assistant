from agents.chat.application.graph import graph


class Agent:
    def __init__(self) -> None:
        self.graph = graph

    async def get_response(self, user_input: str):
        """Get response from LLM"""
        pass
