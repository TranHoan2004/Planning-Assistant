from typing import Annotated

from fastapi import Depends


def pagination_params(page: int = 1, page_size: int = 10):
    return {
        "offset": (page - 1) * page_size,
        "limit": page_size,
    }


Pagination = Annotated[dict, Depends(pagination_params)]
