from flask import Request
from morpheus.common.types.Pagination import PaginationParameters


def create_pagination_parameters_from_request(request: Request) -> PaginationParameters:
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('page_size', default=20, type=int)

    return PaginationParameters.from_ints(page=page, page_size=page_size)
