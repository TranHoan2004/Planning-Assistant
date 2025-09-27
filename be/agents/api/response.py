from fastapi.responses import StreamingResponse

from agents.shared.data_stream.consts import (
    DATA_STREAM_HEADER,
    DATA_STREAM_HEADER_VALUE,
)

HEADERS = {
    # Makes sure the GZip middleware is not applied.
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Transfer-Encoding": "chunked",
    DATA_STREAM_HEADER: DATA_STREAM_HEADER_VALUE,
}


class AgentStreamingResponse(StreamingResponse):
    def __init__(self, stream):
        super().__init__(stream, media_type="text/event-stream", headers=HEADERS)
