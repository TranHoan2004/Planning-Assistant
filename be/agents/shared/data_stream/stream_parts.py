from dataclasses import dataclass
from typing import Any, Dict
import json


@dataclass
class DataStreamPart:
    type: str
    payload: Any | None = None

    def to_dict(self) -> dict:
        data = {"type": self.type}
        if self.payload is None:
            return data
        if isinstance(self.payload, dict):
            data.update(self.payload)
        else:
            # Fallback: include non-dict payloads under a generic 'data' key
            data["data"] = self.payload
        return data

    def format(self) -> str:
        # Compact separators to match examples
        return f"data: {json.dumps(self.to_dict(), separators=(',', ':'))}\n\n"


class DataStreamStartPart(DataStreamPart):
    type: str = "start"

    def __init__(self, msg_id: str):
        super().__init__(self.type, {"messageId": msg_id})


class DataStreamTextStartPart(DataStreamPart):
    type: str = "text-start"
    text_id: str

    def __init__(self, text_id: str):
        super().__init__(self.type, {"id": text_id})


class DataStreamTextDeltaPart(DataStreamPart):
    type: str = "text-delta"
    text_id: str
    delta: str

    def __init__(self, text_id: str, delta: str):
        super().__init__(self.type, {"id": text_id, "delta": delta})


class DataStreamTextEndPart(DataStreamPart):
    type: str = "text-end"
    text_id: str

    def __init__(self, text_id: str):
        super().__init__(self.type, {"id": text_id})


class DataStreamDataPart(DataStreamPart):
    type: str = "data"
    data_type: str
    data: Any

    def __init__(self, data_type: str, data: Any):
        super().__init__(f"{self.type}-{data_type}", {"data": data})


class DataStreamFinishPart(DataStreamPart):
    type: str = "finish"

    def __init__(self):
        super().__init__(self.type, None)


class DataStreamInterruptPart(DataStreamPart):
    type: str = "tool-interrupt"
    metadata: dict

    def __init__(self, metadata: dict):
        super().__init__(self.type, {"metadata": metadata})


class DataStreamStartStepPart(DataStreamPart):
    type: str = "start-step"

    def __init__(self):
        super().__init__(self.type, None)


class DataStreamFinishStepPart(DataStreamPart):
    type: str = "finish-step"

    def __init__(self):
        super().__init__(self.type, None)


class DataStreamToolInputStartPart(DataStreamPart):
    type: str = "tool-input-start"
    tool_call_id: str
    tool_name: str

    def __init__(self, tool_call_id: str, tool_name: str):
        super().__init__(self.type, {"toolCallId": tool_call_id, "toolName": tool_name})


class DataStreamToolInputDeltaPart(DataStreamPart):
    type: str = "tool-input-delta"
    tool_call_id: str
    tool_name: str
    input_text_delta: str

    def __init__(self, tool_call_id: str, tool_name: str, input_text_delta: str):
        super().__init__(
            self.type,
            {
                "toolCallId": tool_call_id,
                "toolName": tool_name,
                "inputTextDelta": input_text_delta,
            },
        )


class DataStreamToolInputAvailablePart(DataStreamPart):
    type: str = "tool-input-available"
    tool_call_id: str
    tool_name: str
    input: Dict[str, Any]

    def __init__(self, tool_call_id: str, tool_name: str, input: Dict[str, Any]):
        super().__init__(
            self.type,
            {
                "toolCallId": tool_call_id,
                "toolName": tool_name,
                "input": json.dumps(input),
            },
        )


class DataStreamToolOutputAvailablePart(DataStreamPart):
    type: str = "tool-output-available"
    tool_call_id: str
    tool_name: str
    output: Dict[str, Any]

    def __init__(self, tool_call_id: str, tool_name: str, output: Dict[str, Any]):
        super().__init__(
            self.type,
            {
                "toolCallId": tool_call_id,
                "toolName": tool_name,
                "output": json.dumps(output),
            },
        )


class DataStreamErrorPart(DataStreamPart):
    type: str = "error"
    error: str

    def __init__(self, error: str):
        super().__init__(self.type, {"errorText": error})


class DataStreamTerminationPart:
    def format(self) -> str:
        return "data: [DONE]\n\n"
