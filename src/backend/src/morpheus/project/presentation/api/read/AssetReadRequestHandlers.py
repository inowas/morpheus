from flask import request
from morpheus.authentication.outgoing import get_logged_in_user_id
from morpheus.common.presentation.api.helpers.pagination import create_pagination_parameters_from_request
from morpheus.project.application.read.AssetReader import asset_reader
from morpheus.project.application.read.ProjectReader import project_reader
from morpheus.project.presentation.api.helpers.asset import asset_file_response, default_preview_image_response, create_filter_for_asset_list
from morpheus.project.types.Asset import AssetId
from morpheus.project.types.Project import ProjectId


class ReadPreviewImageRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str):
        # for now without authentication (see https://redmine.junghanns.it/issues/2388)
        # user_id = get_logged_in_user_id()
        # if user_id is None:
        #     abort(401, 'Unauthorized')

        project_id = ProjectId.from_str(project_id_url_parameter)

        if not project_reader.project_exists(project_id):
            return '', 404

        preview_image_asset = asset_reader.get_preview_image(project_id)
        if preview_image_asset is None:
            return default_preview_image_response()

        return asset_file_response(preview_image_asset)


class ReadAssetListRequestHandler:
    @classmethod
    def handle(cls, project_id_url_parameter: str):
        user_id = get_logged_in_user_id()
        if user_id is None:
            return '', 401

        project_id = ProjectId.from_str(project_id_url_parameter)

        if not project_reader.project_exists(project_id):
            return '', 404

        asset_filter = create_filter_for_asset_list(project_id, request)
        pagination = create_pagination_parameters_from_request(request)

        if pagination is None:
            return {
                'assets': [asset.to_dict() for asset in asset_reader.get_full_asset_list(filter=asset_filter)]
            }, 200

        paginated_assets = asset_reader.get_paginated_asset_list(pagination=pagination, filter=asset_filter)
        return {
            'total': paginated_assets.total_number_of_results,
            'page': paginated_assets.pagination_parameters.page,
            'page_size': paginated_assets.pagination_parameters.page_size,
            'number_of_pages': paginated_assets.get_total_number_of_pages(),
            'assets': [asset.to_dict() for asset in paginated_assets.items],
        }, 200


class ReadAssetRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str, asset_id_url_parameter: str):
        user_id = get_logged_in_user_id()
        if user_id is None:
            return '', 401

        project_id = ProjectId.from_str(project_id_url_parameter)
        asset_id = AssetId.from_str(asset_id_url_parameter)

        if not project_reader.project_exists(project_id):
            return '', 404

        asset = asset_reader.get_asset(project_id, asset_id)
        if asset is None:
            return '', 404

        return asset.to_dict(), 200


class DownloadAssetRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str, asset_id_url_parameter: str):
        user_id = get_logged_in_user_id()
        if user_id is None:
            return '', 401

        project_id = ProjectId.from_str(project_id_url_parameter)
        asset_id = AssetId.from_str(asset_id_url_parameter)

        if not project_reader.project_exists(project_id):
            return '', 404

        asset = asset_reader.get_asset(project_id, asset_id)
        if asset is None:
            return '', 404

        return asset_file_response(asset)


class ReadAssetDataRequestHandler:
    @staticmethod
    def handle(project_id_url_parameter: str, asset_id_url_parameter: str):
        user_id = get_logged_in_user_id()
        if user_id is None:
            return '', 401

        project_id = ProjectId.from_str(project_id_url_parameter)
        asset_id = AssetId.from_str(asset_id_url_parameter)

        if not project_reader.project_exists(project_id):
            return '', 404

        asset_data = asset_reader.get_asset_data(project_id, asset_id)
        if asset_data is None:
            return '', 404

        return asset_data.to_dict(), 200