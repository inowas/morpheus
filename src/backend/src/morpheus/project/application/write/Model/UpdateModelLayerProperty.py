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
from morpheus.project.infrastructure.assets.RasterInterpolationService import RasterInterpolationService
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Asset import AssetId, GeoTiffAssetData
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.discretization.spatial import ActiveCells, Grid
from morpheus.project.types.discretization.spatial.Raster import RasterCoordinates, RasterData, Raster
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.geometry.MultiPolygon import MultiPolygon
from morpheus.project.types.layers.Layer import LayerId, LayerPropertyName, LayerPropertyRaster, LayerPropertyRasterData, LayerPropertyZones, LayerPropertyDefaultValue, Layer, \
    LayerPropertyZone, ZoneId


@dataclasses.dataclass
class LayerPropertyZoneWithOptionalAffectedCells:
    zone_id: ZoneId | None
    affected_cells: ActiveCells | None
    geometry: Polygon | MultiPolygon
    value: float

    @classmethod
    def from_payload(cls, obj):
        return cls(
            zone_id=ZoneId.from_str(obj['zone_id']) if 'zone_id' in obj and obj['zone_id'] else None,
            affected_cells=ActiveCells.from_dict(obj['affected_cells']) if 'affected_cells' in obj and obj['affected_cells'] else None,
            geometry=Polygon.from_dict(obj['geometry']) if obj['geometry']['type'] == 'Polygon' else MultiPolygon.from_dict(obj['geometry']),
            value=obj['value']
        )

    def to_layer_property_zone(self, grid: Grid):
        zone_id = ZoneId.new() if not self.zone_id else self.zone_id
        affected_cells = self.affected_cells if self.affected_cells else ActiveCells.from_geometry(geometry=self.geometry, grid=grid)
        return LayerPropertyZone(zone_id=zone_id, affected_cells=affected_cells, geometry=self.geometry, value=self.value)


class ModelLayerPropertyValueRasterReferencePayload(TypedDict):
    asset_id: str
    band: int
    nodata_value: float | int


class ModelLayerPropertyValueZonePayload(TypedDict):
    zone_id: str
    geometry: dict  # geojson Polygon or MultiPolygon
    affected_cells: Optional[dict]  # ActiveCells
    value: float


class ModelLayerPropertyValueRasterDataPayload(TypedDict):
    data: list[list[float]]
    nodata_value: float | int


class ModelLayerPropertyValueRasterPayload(TypedDict):
    data: Optional[ModelLayerPropertyValueRasterDataPayload]
    reference: Optional[ModelLayerPropertyValueRasterReferencePayload]


class ModelLayerPropertyValuePayload(TypedDict):
    value: float
    raster: Optional[ModelLayerPropertyValueRasterPayload]
    zones: Optional[list[ModelLayerPropertyValueZonePayload]]


class UpdateModelLayerPropertyCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    property_name: Literal['kx', 'ky', 'kz', 'hk', 'hani', 'vani', 'specific_storage', 'specific_yield', 'initial_head', 'top', 'bottom']
    property_default_value: float
    property_raster: Optional[ModelLayerPropertyValueRasterPayload]
    property_zones: Optional[list[ModelLayerPropertyValueZonePayload]]


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerPropertyCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    property_name: LayerPropertyName
    property_value: LayerPropertyDefaultValue
    property_raster: LayerPropertyRaster | None
    property_zones: list[LayerPropertyZoneWithOptionalAffectedCells] | None

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerPropertyCommandPayload):
        property_name = LayerPropertyName(payload['property_name'])
        property_raster = LayerPropertyRaster.from_dict(obj=payload['property_raster']) if 'property_raster' in payload else None
        property_value = LayerPropertyDefaultValue(payload['property_default_value'])

        property_zones = [LayerPropertyZoneWithOptionalAffectedCells.from_payload(obj=zone) for zone in payload['property_zones']] if 'property_zones' in payload and payload[
            'property_zones'] else None

        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.new(),
            layer_id=LayerId.from_str(payload['layer_id']),
            property_name=property_name,
            property_value=property_value,
            property_raster=property_raster,
            property_zones=property_zones
        )


class UpdateModelLayerPropertyCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerPropertyCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        model_reader = ModelReader()
        model = model_reader.get_latest_model(project_id=project_id)
        grid = model.spatial_discretization.grid
        layer = model.layers.get_layer(layer_id=command.layer_id)

        default_value = command.property_value
        raster = command.property_raster
        zones = LayerPropertyZones(zones=[zone.to_layer_property_zone(grid=grid) for zone in command.property_zones]) if command.property_zones else None

        if not isinstance(layer, Layer):
            raise ValueError(f'Layer {command.layer_id.to_str()} not found in model {model.model_id.to_str()}')

        if raster and raster.reference and not raster.data:
            reference = raster.reference
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
            input_raster_data = RasterData(data=raster_asset_data.data, nodata_value=-9999)
            input_raster = Raster(input_raster_coords, input_raster_data)

            # interpolate raster data to model geometry
            interpolation_service = RasterInterpolationService()

            xx_coords, yy_coords = grid.get_wgs_coordinates()
            output_coords = RasterCoordinates(xx_coords=xx_coords, yy_coords=yy_coords)
            output_raster = interpolation_service.interpolate_raster(raster=input_raster, new_coords=output_coords, method='linear', nodata_value=-9999)
            raster.data = LayerPropertyRasterData(data=output_raster.data.get_data(), nodata_value=output_raster.data.get_nodata_value())

        event = ModelLayerPropertyUpdatedEvent.for_property(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            property_name=command.property_name,
            property_default_value=default_value,
            occurred_at=DateTime.now()
        )

        layer_property = layer.properties.get_property(property_name=command.property_name)

        if not layer_property:
            event = event.with_updated_raster(raster)
            event = event.with_updated_zones(zones)

        if layer_property and layer_property.raster != raster:
            event = event.with_updated_raster(raster)

        if layer_property and layer_property.zones != zones:
            event = event.with_updated_zones(zones)

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
