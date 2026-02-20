import dataclasses
from typing import Literal, TypedDict

from morpheus.common.types import DateTime, Uuid
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.AssetReader import get_asset_reader
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents.ModelLayerEvents import ModelLayerPropertyUpdatedEvent
from morpheus.project.infrastructure.assets.RasterInterpolationService import InterpolationMethod, RasterData, RasterInterpolationService
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Asset import AssetId, GeoTiffAssetData, RasterBand
from morpheus.project.types.layers.Layer import Layer, LayerId, LayerPropertyName, LayerPropertyRaster, LayerPropertyRasterData, LayerPropertyRasterReference
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId


class ModelLayerPropertyValueRasterReferencePayload(TypedDict):
    asset_id: str
    band: int


class UpdateModelLayerPropertyRasterReferenceCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    property_name: Literal['hk', 'hani', 'vka', 'specific_storage', 'specific_yield', 'initial_head', 'top', 'bottom']
    property_raster_reference: ModelLayerPropertyValueRasterReferencePayload | None


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerPropertyRasterReferenceCommand(ProjectCommandBase):
    model_id: ModelId
    layer_id: LayerId
    property_name: LayerPropertyName
    property_raster_reference: LayerPropertyRasterReference | None

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerPropertyRasterReferenceCommandPayload):
        property_name = LayerPropertyName(payload['property_name'])

        raster_reference = None
        if payload['property_raster_reference']:
            raster_reference = LayerPropertyRasterReference.from_payload(payload['property_raster_reference'])

        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            property_name=property_name,
            property_raster_reference=raster_reference,
        )

    def get_asset_id(self) -> AssetId | None:
        return AssetId.from_str(self.property_raster_reference.asset_id) if self.property_raster_reference else None

    def get_band(self) -> RasterBand | None:
        return RasterBand(self.property_raster_reference.band) if self.property_raster_reference else None


class UpdateModelLayerPropertyRasterReferenceCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerPropertyRasterReferenceCommand):
        project_id = command.project_id
        user_id = command.user_id

        event = ModelLayerPropertyUpdatedEvent.from_raster(
            project_id=project_id, model_id=command.model_id, layer_id=command.layer_id, property_name=command.property_name, property_raster=None, occurred_at=DateTime.now()
        )

        if command.property_raster_reference:
            raster_asset_id = command.get_asset_id()
            raster_band = command.get_band()

            if raster_asset_id is None or raster_band is None:
                raise ValueError('Raster reference must have an asset_id and a band')

            model_reader = ModelReader()
            model = model_reader.get_latest_model(project_id=project_id)
            grid = model.spatial_discretization.grid
            layer = model.layers.get_layer(layer_id=command.layer_id)

            if not isinstance(layer, Layer):
                raise ValueError(f'Layer {command.layer_id.to_str()} not found in model {model.model_id.to_str()}')

            # read asset data
            asset_reader = get_asset_reader()  # AssetReader
            raster_asset_data = asset_reader.get_raster_asset_data(project_id=project_id, asset_id=raster_asset_id, band=raster_band.to_int())
            raster_asset_no_data_value = asset_reader.get_raster_asset_no_data_value(project_id=project_id, asset_id=raster_asset_id)

            if not isinstance(raster_asset_data, GeoTiffAssetData):
                raise ValueError(f'Asset {raster_asset_id.to_str()} not found in project {project_id.to_str()}')

            raster_coordinates = asset_reader.get_raster_asset_coords(project_id=project_id, asset_id=raster_asset_id, bbox=grid.get_wgs_bbox())
            if raster_coordinates is None:
                raise ValueError(f'Asset {raster_asset_id.to_str()} does not cover the model geometry')

            input_raster_xx, input_raster_yy = raster_coordinates
            input_raster_data = RasterData(
                xx_centers=input_raster_xx, yy_centers=input_raster_yy, bounds=grid.get_wgs_bbox(), data=raster_asset_data.data, nodata_value=raster_asset_no_data_value.to_float()
            )

            # interpolate raster data to model geometry
            interpolation_service = RasterInterpolationService()

            data, nodata_value = interpolation_service.raster_data_to_grid_data(raster_data=input_raster_data, grid=grid, method=InterpolationMethod.linear, no_data_value=-9999)
            property_raster = LayerPropertyRaster(
                reference=LayerPropertyRasterReference(asset_id=raster_asset_id.to_str(), band=raster_band.to_int()),
                data=LayerPropertyRasterData(data=data, nodata_value=nodata_value),
            )

            event = ModelLayerPropertyUpdatedEvent.from_raster(
                project_id=project_id,
                model_id=command.model_id,
                layer_id=command.layer_id,
                property_name=command.property_name,
                property_raster=property_raster,
                occurred_at=DateTime.now(),
            )

        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
