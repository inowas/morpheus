from collections.abc import Sequence

from morpheus.project.types.boundaries.Boundary import (
    Boundary,
    BoundaryId,
    BoundaryName,
    BoundaryTags,
    BoundaryType,
    ConstantHeadBoundary,
    DrainBoundary,
    EvapotranspirationBoundary,
    FlowAndHeadBoundary,
    GeneralHeadBoundary,
    LakeBoundary,
    RechargeBoundary,
    RiverBoundary,
    WellBoundary,
)
from morpheus.project.types.boundaries.BoundaryInterpolationType import InterpolationType
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadObservationValue
from morpheus.project.types.boundaries.DrainObservation import DrainRawDataItem
from morpheus.project.types.boundaries.EvapotranspirationObservation import EvapotranspirationObservationValue
from morpheus.project.types.boundaries.FlowAndHeadObservation import FlowAndHeadRawDataItem
from morpheus.project.types.boundaries.GeneralHeadObservation import GeneralHeadRawDataItem
from morpheus.project.types.boundaries.LakeObservation import LakeObservationValue
from morpheus.project.types.boundaries.Observation import StartDateTime
from morpheus.project.types.boundaries.RechargeObservation import RechargeObservationValue
from morpheus.project.types.boundaries.RiverObservation import RiverObservationValue
from morpheus.project.types.boundaries.WellObservation import WellObservationValue
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import LineString, Point, Polygon
from morpheus.project.types.layers import LayerId


class BoundaryFactory:
    @staticmethod
    def assert_is_point(geometry: Point | LineString | Polygon) -> Point:
        if not isinstance(geometry, Point):
            raise ValueError('Geometry must be a point')
        return geometry

    @staticmethod
    def assert_is_line_string(geometry: Point | LineString | Polygon) -> LineString:
        if not isinstance(geometry, LineString):
            raise ValueError('Geometry must be a line string')
        return geometry

    @staticmethod
    def assert_is_polygon(geometry: Point | LineString | Polygon) -> Polygon:
        if not isinstance(geometry, Polygon):
            raise ValueError('Geometry must be a polygon')
        return geometry

    def create_with_default_observation_values(
        self,
        boundary_id: BoundaryId,
        boundary_type: BoundaryType,
        geometry: Point | LineString | Polygon,
        affected_cells: ActiveCells,
        affected_layers: Sequence[LayerId],
        start_date_time: StartDateTime,
        name: BoundaryName | None = None,
        tags: BoundaryTags | None = None,
    ) -> Boundary | None:

        if boundary_type == BoundaryType.constant_head:
            geometry = self.assert_is_line_string(geometry)
            return ConstantHeadBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[ConstantHeadObservationValue.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.drain:
            geometry = self.assert_is_line_string(geometry)
            return DrainBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[DrainRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.evapotranspiration:
            geometry = self.assert_is_polygon(geometry)
            return EvapotranspirationBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[EvapotranspirationObservationValue.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.flow_and_head:
            geometry = self.assert_is_line_string(geometry)
            return FlowAndHeadBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[FlowAndHeadRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.general_head:
            geometry = self.assert_is_line_string(geometry)
            return GeneralHeadBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[GeneralHeadRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.lake:
            geometry = self.assert_is_polygon(geometry)
            return LakeBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[LakeObservationValue.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.recharge:
            geometry = self.assert_is_polygon(geometry)
            return RechargeBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[RechargeObservationValue.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.river:
            geometry = self.assert_is_line_string(geometry)
            return RiverBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[RiverObservationValue.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.well:
            geometry = self.assert_is_point(geometry)
            return WellBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[WellObservationValue.default(date_time=start_date_time)],
            )

        return None

    def create_from_single_observation_import(
        self,
        boundary_id: BoundaryId,
        boundary_type: BoundaryType,
        name: BoundaryName,
        interpolation: InterpolationType,
        tags: BoundaryTags,
        geometry: Point | LineString | Polygon,
        affected_cells: ActiveCells,
        affected_layers: Sequence[LayerId],
        data: list[dict],
        start_date_time: StartDateTime,
    ) -> Boundary | None:

        boundary_type = BoundaryType.from_str(boundary_type)
        if boundary_type == BoundaryType.constant_head:
            geometry = self.assert_is_line_string(geometry)
            data.insert(0, ConstantHeadObservationValue.default(date_time=start_date_time).to_dict())
            return ConstantHeadBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[ConstantHeadObservationValue.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.drain:
            geometry = self.assert_is_line_string(geometry)
            data.insert(0, DrainRawDataItem.default(date_time=start_date_time).to_dict())
            return DrainBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[DrainRawDataItem.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.evapotranspiration:
            geometry = self.assert_is_polygon(geometry)
            data.insert(0, EvapotranspirationObservationValue.default(date_time=start_date_time).to_dict())
            return EvapotranspirationBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[EvapotranspirationObservationValue.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.flow_and_head:
            geometry = self.assert_is_line_string(geometry)
            data.insert(0, FlowAndHeadRawDataItem.default(date_time=start_date_time).to_dict())
            return FlowAndHeadBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[FlowAndHeadRawDataItem.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.general_head:
            geometry = self.assert_is_line_string(geometry)
            data.insert(0, GeneralHeadRawDataItem.default(date_time=start_date_time).to_dict())
            return GeneralHeadBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[GeneralHeadRawDataItem.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.lake:
            geometry = self.assert_is_polygon(geometry)
            data.insert(0, LakeObservationValue.default(date_time=start_date_time).to_dict())
            return LakeBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[LakeObservationValue.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.recharge:
            geometry = self.assert_is_polygon(geometry)
            data.insert(0, RechargeObservationValue.default(date_time=start_date_time).to_dict())
            return RechargeBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[RechargeObservationValue.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.river:
            geometry = self.assert_is_line_string(geometry)
            data.insert(0, RiverObservationValue.default(date_time=start_date_time).to_dict())
            return RiverBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[RiverObservationValue.from_dict(item) for item in data],
            )

        if boundary_type == BoundaryType.well:
            geometry = self.assert_is_point(geometry)
            data.insert(0, WellObservationValue.default(date_time=start_date_time).to_dict())
            return WellBoundary.new(
                boundary_id=boundary_id,
                name=name,
                interpolation=interpolation,
                tags=tags,
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[WellObservationValue.from_dict(item) for item in data],
            )

        return None
