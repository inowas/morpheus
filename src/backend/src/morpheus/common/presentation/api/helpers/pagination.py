from flask import Request

from morpheus.common.types.Pagination import PaginationParameters


def create_pagination_parameters_from_request(request: Request) -> PaginationParameters | None:
    page = request.args.get('page', default=None, type=int)
    page_size = request.args.get('page_size', default=None, type=int)

    if page is None or page < 1 or page_size is None or page_size < 1:
        return None

    return PaginationParameters.from_ints(page=page, page_size=page_size)
