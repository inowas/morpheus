from morpheus.common.types.File import FileName
from morpheus.project.types.Asset import AssetDescription, AssetFilter, AssetType
from morpheus.project.types.Project import ProjectId


def create_filter_for_asset_list(project_id: ProjectId, asset_type: str | None, file_name: str | None, description: str | None) -> AssetFilter:
    asset_type_or_none = asset_type
    file_name_or_none = file_name
    description_or_none = description

    if asset_type_or_none is not None:
        asset_type_or_none = asset_type_or_none.strip()
        if len(asset_type_or_none) == 0:
            asset_type_or_none = None
    if file_name_or_none is not None:
        file_name_or_none = file_name_or_none.strip()
        if len(file_name_or_none) == 0:
            file_name_or_none = None
    if description_or_none is not None:
        description_or_none = description_or_none.strip()
        if len(description_or_none) == 0:
            description_or_none = None

    return AssetFilter(
        project_id=project_id,
        asset_type=[AssetType(asset_type_or_none)] if asset_type_or_none is not None else [AssetType.GEO_TIFF, AssetType.SHAPEFILE],
        file_name=FileName(file_name_or_none) if file_name_or_none is not None else None,
        description=AssetDescription.try_from_str(description_or_none),
    )
