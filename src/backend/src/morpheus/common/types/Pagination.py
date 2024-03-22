import dataclasses
from typing import NewType

Page = NewType('Page', int)
PageSize = NewType('PageSize', int)


@dataclasses.dataclass(frozen=True)
class PaginationParameters:
    page: Page
    page_size: PageSize

    @classmethod
    def from_ints(cls, page: int, page_size: int):
        return cls(page=Page(page), page_size=PageSize(page_size))
