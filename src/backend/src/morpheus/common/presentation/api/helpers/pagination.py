from morpheus.common.types.Pagination import PaginationParameters


def create_pagination_parameters(page: int | None, page_size: int | None) -> PaginationParameters | None:
    if page is None or page < 1 or page_size is None or page_size < 1:
        return None

    return PaginationParameters.from_ints(page=page, page_size=page_size)
