from dataclasses import dataclass
from typing import Any
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


class DataStreamMessageStartPart(DataStreamPart):
    def __init__(self, message_id: str):
        super().__init__("start", {"messageId": message_id})


class DataStreamTextStartPart(DataStreamPart):
    def __init__(self, text_id: str):
        super().__init__("text-start", {"id": text_id})


class DataStreamTextDeltaPart(DataStreamPart):
    def __init__(self, text_id: str, delta: str):
        super().__init__("text-delta", {"id": text_id, "delta": delta})


class DataStreamTextEndPart(DataStreamPart):
    def __init__(self, text_id: str):
        super().__init__("text-end", {"id": text_id})


class DataStreamDataPart(DataStreamPart):
    def __init__(self, type: str, data: Any):
        super().__init__(f"data-{type}", {"data": data})


class DataStreamFinishPart(DataStreamPart):
    def __init__(self):
        super().__init__("finish", None)


class DataStreamInterruptPart(DataStreamPart):
    def __init__(self, metadata: dict):
        super().__init__("tool-interrupt", {"metadata": metadata})
