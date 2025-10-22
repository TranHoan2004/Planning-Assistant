from typing import Any, AsyncIterator, Dict, Optional, Sequence, Tuple
from uuid import uuid4

from dataclasses import dataclass

from agents.shared.data_stream.stream_parts import (
    DataStreamDataPart,
    DataStreamErrorPart,
    DataStreamFinishPart,
    DataStreamFinishStepPart,
    DataStreamStartPart,
    DataStreamStartStepPart,
    DataStreamTerminationPart,
    DataStreamTextDeltaPart,
    DataStreamTextEndPart,
    DataStreamTextStartPart,
)


@dataclass
class CustomDataStreamConfig:
    key: str
    node_name: str
    data_type: str


class StreamResponse:
    """Vercel AI SDK v5 compatible stream response"""

    _iterator: AsyncIterator[Dict[str, Any] | Any]
    _messages_streamable_nodes: Optional[Sequence[str]]
    _custom_data_stream_config: Sequence[CustomDataStreamConfig]
    _message_started: bool
    _message_id: str
    _text_id: str

    def __init__(
        self,
        iterator: AsyncIterator[Dict[str, Any] | Any],
        messages_streamable_nodes: Optional[Sequence[str]] = None,
        custom_data_stream_config: Optional[Sequence[CustomDataStreamConfig]] = None,
    ):
        self._iterator = iterator
        self._messages_streamable_nodes = messages_streamable_nodes
        self._message_started = False
        self._message_id = f"{uuid4().hex}"
        self._text_id = f"msg_{self._message_id}"
        self._custom_data_stream_config = custom_data_stream_config or []

    async def __aiter__(self):
        try:
            async for chunk in self._iterator:
                if isinstance(chunk, tuple):
                    _, stream_mode, step = chunk
                    if (
                        stream_mode == "messages"
                        and isinstance(step, tuple)
                        and len(step) == 2
                    ):
                        for part in self._stream_text_delta(step):
                            yield part
                    elif stream_mode == "custom" and isinstance(step, dict):
                        for part in self._stream_custom_data(step):
                            yield part

        except Exception as e:
            yield DataStreamErrorPart(error=str(e)).format()
        finally:
            if self._message_started:
                yield DataStreamTextEndPart(self._text_id).format()
                yield DataStreamFinishStepPart().format()
                yield DataStreamFinishPart().format()
        yield DataStreamTerminationPart().format()

    def _stream_text_delta(self, step: Tuple):
        message, metadata = step
        if self._messages_streamable_nodes:
            if metadata.get("langgraph_node") in self._messages_streamable_nodes:
                if hasattr(message, "content") and message.content:
                    if not self._message_started:
                        yield DataStreamStartPart(self._message_id).format()
                        yield DataStreamStartStepPart().format()
                        yield DataStreamTextStartPart(self._text_id).format()
                        self._message_started = True
                    yield DataStreamTextDeltaPart(
                        self._text_id, message.content
                    ).format()
        else:
            if hasattr(message, "content") and message.content:
                if not self._message_started:
                    yield DataStreamStartPart(self._message_id).format()
                    yield DataStreamStartStepPart().format()
                    yield DataStreamTextStartPart(self._text_id).format()
                    self._message_started = True
                yield DataStreamTextDeltaPart(self._text_id, message.content).format()

    def _stream_custom_data(self, step: Dict[str, Any]):
        if len(self._custom_data_stream_config) > 0:
            for config in self._custom_data_stream_config:
                step_key = config.key
                node_name = config.node_name
                data_type = config.data_type

                payload = step.get(step_key)
                if payload:
                    data = payload.get("data")
                    metadata = payload.get("metadata", {})
                    if metadata.get("langgraph_node") == node_name:
                        yield DataStreamDataPart(data_type, data).format()
