import dataclasses

from flask import Request, abort

from morpheus.assets.incoming import get_logged_in_user_id
from morpheus.assets.presentation.helpers.filters import create_asset_list_filter_from_request
from morpheus.common.presentation.helpers.pagination import create_pagination_parameters_from_request


class ReadAssetListRequestHandler:
    def handle(self, request: Request):
        user_id = get_logged_in_user_id()
        if user_id is None:
            abort(401, 'Unauthorized')

        pagination_parameters = create_pagination_parameters_from_request(request)
        asset_list_filter = create_asset_list_filter_from_request(request)

        result = []
        return result, 200
