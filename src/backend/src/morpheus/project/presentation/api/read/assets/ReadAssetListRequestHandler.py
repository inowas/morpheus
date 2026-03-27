from flask import request

from morpheus.common.presentation.api.helpers.pagination import create_pagination_parameters_from_request
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.exceptions import InsufficientPermissionsException
from morpheus.project.incoming import get_identity
from morpheus.project.presentation.api.helpers.asset import create_filter_for_asset_list
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ReadAssetListRequestHandler:
    @classmethod
    def handle(cls, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        if not project_reader.project_exists(project_id):
            return '', 404

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            asset_reader = get_asset_reader()
            asset_filter = create_filter_for_asset_list(project_id, request)
            pagination = create_pagination_parameters_from_request(request)

            if pagination is None:
                return {'assets': [asset.to_dict() for asset in asset_reader.get_full_asset_list(filter=asset_filter)]}, 200

            paginated_assets = asset_reader.get_paginated_asset_list(pagination=pagination, filter=asset_filter)
            return {
                'total': paginated_assets.total_number_of_results,
                'page': paginated_assets.pagination_parameters.page,
                'page_size': paginated_assets.pagination_parameters.page_size,
                'number_of_pages': paginated_assets.get_total_number_of_pages(),
                'assets': [asset.to_dict() for asset in paginated_assets.results],
            }, 200
        except InsufficientPermissionsException as e:
            return str(e), 403
