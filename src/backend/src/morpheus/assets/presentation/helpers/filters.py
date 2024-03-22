from flask import Request

from morpheus.assets.types.AssetList import AssetListFilter
from morpheus.assets.types.User import UserId


def create_asset_list_filter_from_request(request: Request) -> AssetListFilter:
    user_id = UserId.try_from_str(request.args.get('user_id', default=None, type=str))
    return AssetListFilter(user_id=user_id)
