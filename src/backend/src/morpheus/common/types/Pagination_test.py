import pytest

from morpheus.common.types.Pagination import Page, PageSize, PaginatedResults, PaginationParameters


@pytest.mark.parametrize(
    'page,page_size',
    [
        (0, 0),
        (0, 1),
        (1, 0),
        (-1, -1),
        (-1, 1),
        (1, -1),
    ],
)
def test_pagination_parameters_must_be_greater_zero(page, page_size) -> None:
    with pytest.raises(ValueError):
        PaginationParameters.from_ints(page=page, page_size=page_size)
    with pytest.raises(ValueError):
        PaginationParameters(page=Page(page), page_size=PageSize(page_size))


@pytest.mark.parametrize(
    'page,page_size,expected_skipped_items',
    [
        (1, 1, 0),
        (1, 5, 0),
        (1, 10, 0),
        (2, 1, 1),
        (2, 5, 5),
        (2, 10, 10),
        (99, 1, 98),
        (7, 111, 666),
    ],
)
def test_pagination_parameters_calculates_offset(page, page_size, expected_skipped_items) -> None:
    pagination_parameters = PaginationParameters.from_ints(page=page, page_size=page_size)
    assert pagination_parameters.get_number_of_skipped_items_from_beginning() == expected_skipped_items


@pytest.mark.parametrize(
    'total_results,items',
    [
        (-10, [1]),  # total_results must be greater or equal to zero
        (-1, [1]),  # total_results must be greater or equal to zero
        (0, [1]),  # total_results must be greater or equal to number of items
        (3, [1, 2, 3, 4]),  # number of items must be less or equal to total_results
    ],
)
def test_paginated_results_total_items_must_be_greater_or_equal_zero_and_greater_or_equal_number_of_items(total_results, items) -> None:
    with pytest.raises(ValueError):
        PaginatedResults(PaginationParameters.from_ints(1, len(items)), total_number_of_results=total_results, results=items)


@pytest.mark.parametrize(
    'page_size,total_items,expected_total_pages',
    [
        (1, 0, 0),
        (5, 0, 0),
        (10, 0, 0),
        (1, 40, 40),
        (5, 40, 8),
        (10, 40, 4),
        (13, 12, 1),
        (13, 13, 1),
        (13, 14, 2),
        (13, 26, 2),
        (13, 38, 3),
    ],
)
def test_paginated_results_calculate_total_pages(page_size, total_items, expected_total_pages) -> None:
    pagination_parameters = PaginationParameters.from_ints(page=1, page_size=page_size)
    paginated_results = PaginatedResults(pagination_parameters, total_number_of_results=total_items, results=list(range(total_items)))

    assert paginated_results.get_total_number_of_pages() == expected_total_pages
