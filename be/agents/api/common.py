from typing import Annotated, Dict, Generic, Sequence, TypeVar

from fastapi import Depends
from pydantic import BaseModel


def pagination_params(page: int = 1, page_size: int = 10) -> Dict[str, int]:
    return {
        "page": page,
        "limit": page_size,
    }


Pagination = Annotated[Dict[str, int], Depends(pagination_params)]

T = TypeVar("T")


class Page(BaseModel):
    number: int
    page_size: int
    has_next: bool


class PaginatedResponse(BaseModel, Generic[T]):
    data: Sequence[T]
    page: Page
