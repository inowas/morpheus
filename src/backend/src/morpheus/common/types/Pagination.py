import dataclasses
from typing import NewType, TypeVar, Generic

from math import ceil

Page = NewType('Page', int)
PageSize = NewType('PageSize', int)


@dataclasses.dataclass(frozen=True)
class PaginationParameters:
    page: Page
    page_size: PageSize

    def __post_init__(self):
        if self.page < 1 or self.page_size < 1:
            raise ValueError('Page and page size must be greater than 0')

    @classmethod
    def from_ints(cls, page: int, page_size: int):
        return cls(page=Page(page), page_size=PageSize(page_size))

    def get_number_of_skipped_items_from_beginning(self) -> int:
        return (self.page - 1) * self.page_size


PaginatedItem = TypeVar('PaginatedItem')


@dataclasses.dataclass(frozen=True)
class PaginatedResults(Generic[PaginatedItem]):
    pagination_parameters: PaginationParameters
    total_number_of_results: int
    items: list[PaginatedItem]

    def __post_init__(self):
        if self.total_number_of_results < 0:
            raise ValueError('Total number of results must be greater than or equal to 0')
        if len(self.items) > self.total_number_of_results:
            raise ValueError('Number of items must be less than or equal to total number of results')

    def get_total_number_of_pages(self) -> int:
        return ceil(self.total_number_of_results / self.pagination_parameters.page_size)
