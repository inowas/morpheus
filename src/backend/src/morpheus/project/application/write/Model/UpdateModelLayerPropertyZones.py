import dataclasses
from typing import TypedDict, Literal, Optional

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.Exceptions import InsufficientPermissionsException
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import PermissionsReader
from morpheus.project.application.write.CommandBase import CommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.ModelEvents import ModelLayerPropertyUpdatedEvent
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.User import UserId
from morpheus.project.types.discretization.spatial import ActiveCells, Grid
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.geometry.MultiPolygon import MultiPolygon
from morpheus.project.types.layers.Layer import LayerId, LayerPropertyName, LayerPropertyZones, Layer, \
    LayerPropertyZone, ZoneId, ZoneName


@dataclasses.dataclass
class LayerPropertyZoneWithOptionalAffectedCells:
    zone_id: ZoneId | None
    name: ZoneName | None
    affected_cells: ActiveCells | None
    geometry: Polygon | MultiPolygon
    value: float

    @classmethod
    def from_payload(cls, obj):
        return cls(
            zone_id=ZoneId.from_str(obj['zone_id']) if 'zone_id' in obj and obj['zone_id'] else None,
            name=ZoneName.from_str(obj['name']) if 'name' in obj else ZoneName('New Zone'),
            affected_cells=ActiveCells.from_dict(obj['affected_cells']) if 'affected_cells' in obj and obj['affected_cells'] else None,
            geometry=Polygon.from_dict(obj['geometry']) if obj['geometry']['type'] == 'Polygon' else MultiPolygon.from_dict(obj['geometry']),
            value=obj['value']
        )

    def to_layer_property_zone(self, grid: Grid):
        zone_id = ZoneId.new() if not self.zone_id else self.zone_id
        affected_cells = self.affected_cells if self.affected_cells else ActiveCells.from_geometry(geometry=self.geometry, grid=grid)
        zone_name = self.name if self.name else ZoneName('New Zone')
        return LayerPropertyZone(zone_id=zone_id, name=zone_name, affected_cells=affected_cells, geometry=self.geometry, value=self.value)


class ModelLayerPropertyValueZonePayload(TypedDict):
    zone_id: str
    name: str
    geometry: dict  # geojson Polygon or MultiPolygon
    affected_cells: Optional[dict]  # ActiveCells
    value: float


class UpdateModelLayerPropertyZonesCommandPayload(TypedDict):
    project_id: str
    model_id: str
    layer_id: str
    property_name: Literal['hk', 'hani', 'vka', 'specific_storage', 'specific_yield', 'initial_head', 'top', 'bottom']
    property_zones: list[ModelLayerPropertyValueZonePayload] | None


@dataclasses.dataclass(frozen=True)
class UpdateModelLayerPropertyZonesCommand(CommandBase):
    project_id: ProjectId
    model_id: ModelId
    layer_id: LayerId
    property_name: LayerPropertyName
    property_zones: list[LayerPropertyZoneWithOptionalAffectedCells] | None

    @classmethod
    def from_payload(cls, user_id: UserId, payload: UpdateModelLayerPropertyZonesCommandPayload):
        property_name = LayerPropertyName(payload['property_name'])
        property_zones = [LayerPropertyZoneWithOptionalAffectedCells.from_payload(obj=zone) for zone in payload['property_zones']] if 'property_zones' in payload and payload[
            'property_zones'] else None

        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            model_id=ModelId.from_str(payload['model_id']),
            layer_id=LayerId.from_str(payload['layer_id']),
            property_name=property_name,
            property_zones=property_zones
        )


class UpdateModelLayerPropertyZonesCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: UpdateModelLayerPropertyZonesCommand):
        project_id = command.project_id
        user_id = command.user_id
        permissions = PermissionsReader().get_permissions(project_id=project_id)

        if not permissions.member_can_edit(user_id=user_id):
            raise InsufficientPermissionsException(f'User {user_id.to_str()} does not have permission to update the time discretization of {project_id.to_str()}')

        event = ModelLayerPropertyUpdatedEvent.from_zones(
            project_id=project_id,
            model_id=command.model_id,
            layer_id=command.layer_id,
            property_name=command.property_name,
            property_zones=None,
            occurred_at=DateTime.now()
        )

        if command.property_zones:
            model_reader = ModelReader()
            model = model_reader.get_latest_model(project_id=project_id)
            grid = model.spatial_discretization.grid
            layer = model.layers.get_layer(layer_id=command.layer_id)

            if not isinstance(layer, Layer):
                raise ValueError(f'Layer {command.layer_id.to_str()} not found in model {model.model_id.to_str()}')

            property_zones = LayerPropertyZones(zones=[zone.to_layer_property_zone(grid=grid) for zone in command.property_zones])

            event = ModelLayerPropertyUpdatedEvent.from_zones(
                project_id=project_id,
                model_id=command.model_id,
                layer_id=command.layer_id,
                property_name=command.property_name,
                property_zones=property_zones,
                occurred_at=DateTime.now()
            )

        event_metadata = EventMetadata.new(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
