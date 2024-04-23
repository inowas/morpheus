import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelLayerPropertyUpdatedEvent
from morpheus.project.infrastructure.assets.RasterInterpolationService import RasterInterpolationService, RasterCoordinates, RasterData, Raster
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Asset import AssetId, GeoTiffAssetData
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.layers.Layer import LayerId, LayerPropertyName, LayerPropertyValue


class ModelLayerPropertyValueRasterReferencePayload(TypedDict):
    asset_id: str
    asset_type: Literal['raster']
    band: int


class ModelLayerPropertyValueZonePayload(TypedDict):
    zone_id: str
    geometry: dict  # geojson Polygon or MultiPolygon
    value: float


class ModelLayerPropertyValueRasterPayload(TypedDict):
    data: Optional[list[list[float]]]
    reference: Optional[ModelLayerPropertyValueRasterReferencePayload]


class ModelLayerPropertyValuePayload(TypedDict):
    value: float
    raster: Optional[ModelLayerPropertyValueRasterPayload]
    zones: Optional[list[ModelLayerPropertyValueZonePayload]]


class UpdateModelLayerPropertyCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    property_name: Literal['kx', 'ky', 'kz', 'specific_storage', 'specific_yield', 'initial_head', 'top', 'bottom']
    property_value: ModelLayerPropertyValuePayload


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerPropertyCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    property_name: LayerPropertyName
    property_value: LayerPropertyValue

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerPropertyCommandPayload):
        property_name = LayerPropertyName(payload['property_name'])
        property_value = LayerPropertyValue.from_dict(payload['property_value'])

        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            layer_id=LayerId.from_str(payload['layer_id']),
            property_name=property_name,
            property_value=property_value,
        )


class UpdateModelLayerPropertyCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerPropertyCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        # if the user references a raster, we need to interpolate the raster to the layer's geometry
        property_value = command.property_value

        # This is not in every case necessary
        # We could add a check if the raster or zone is needed to be interpolated or recalculated
        model_reader = ModelReader()
        model = model_reader.get_latest_model(project_id=project_id)
        grid = model.spatial_discretization.grid

        if property_value.raster and property_value.raster.reference and not property_value.raster.data:
            reference = property_value.raster.reference
            asset_id = AssetId.from_str(reference.asset_id)
            band = reference.band

            # read asset data
            asset_reader = get_asset_reader()  # AssetReader
            raster_asset_data = asset_reader.get_raster_asset_data(project_id=project_id, asset_id=asset_id, band=band)

            if not isinstance(raster_asset_data, GeoTiffAssetData):
                raise ValueError(f'Asset {asset_id.to_str()} not found in project {project_id.to_str()}')

            raster_coordinates = asset_reader.get_raster_asset_coords(project_id=project_id, asset_id=asset_id, bbox=grid.bbox())
            if raster_coordinates is None:
                raise ValueError(f'Asset {asset_id.to_str()} does not cover the model geometry')

            input_raster_xx, input_raster_yy = raster_coordinates
            input_raster_coords = RasterCoordinates(xx_coords=input_raster_xx, yy_coords=input_raster_yy)
            input_raster_data = RasterData(data=raster_asset_data.data)
            input_raster = Raster(input_raster_coords, input_raster_data)

            # interpolate raster data to model geometry
            interpolation_service = RasterInterpolationService()

            xx_coords, yy_coords = grid.get_wgs_coordinates()
            output_coords = RasterCoordinates(xx_coords=xx_coords, yy_coords=yy_coords)
            output_raster = interpolation_service.interpolate_raster(raster=input_raster, new_coords=output_coords, method='linear', fill_value=None)
            property_value.raster.data = output_raster.data.data

        if property_value.zones:
            for zone in property_value.zones:
                if not zone.affected_cells:
                    zone.affected_cells = ActiveCells.from_geometry(zone.geometry, grid)

        event = ModelLayerPropertyUpdatedEvent.from_property(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            property_name=command.property_name,
            property_value=command.property_value,
            occurred_at=DateTime.now()
        )

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
