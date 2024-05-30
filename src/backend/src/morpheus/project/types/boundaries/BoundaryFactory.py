from typing import Sequence

from morpheus.project.types.boundaries.Boundary import Boundary, BoundaryType, WellBoundary, ConstantHeadBoundary, \
    EvapotranspirationBoundary, FlowAndHeadBoundary, DrainBoundary, GeneralHeadBoundary, LakeBoundary, RechargeBoundary, RiverBoundary, BoundaryName, BoundaryTags, BoundaryId
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadRawDataItem
from morpheus.project.types.boundaries.DrainObservation import DrainRawDataItem
from morpheus.project.types.boundaries.EvapotranspirationObservation import EvapotranspirationRawDataItem
from morpheus.project.types.boundaries.FlowAndHeadObservation import FlowAndHeadRawDataItem
from morpheus.project.types.boundaries.GeneralHeadObservation import GeneralHeadRawDataItem
from morpheus.project.types.boundaries.LakeObservation import LakeRawDataItem
from morpheus.project.types.boundaries.Observation import StartDateTime
from morpheus.project.types.boundaries.RechargeObservation import RechargeRawDataItem
from morpheus.project.types.boundaries.RiverObservation import RiverRawDataItem
from morpheus.project.types.boundaries.WellObservation import WellRawDataItem
from morpheus.project.types.discretization.spatial import ActiveCells
from morpheus.project.types.geometry import Point, LineString, Polygon
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

    def create_with_default_data(self, boundary_id: BoundaryId, boundary_type: BoundaryType, geometry: Point | LineString | Polygon, affected_cells: ActiveCells,
                                 affected_layers: Sequence[LayerId], start_date_time: StartDateTime, name: BoundaryName | None = None,
                                 tags: BoundaryTags | None = None) -> Boundary | None:

        if boundary_type == BoundaryType.constant_head():
            geometry = self.assert_is_line_string(geometry)
            return ConstantHeadBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[ConstantHeadRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.drain():
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

        if boundary_type == BoundaryType.evapotranspiration():
            geometry = self.assert_is_polygon(geometry)
            return EvapotranspirationBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[EvapotranspirationRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.flow_and_head():
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

        if boundary_type == BoundaryType.general_head():
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

        if boundary_type == BoundaryType.lake():
            geometry = self.assert_is_polygon(geometry)
            return LakeBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[LakeRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.recharge():
            geometry = self.assert_is_polygon(geometry)
            return RechargeBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[RechargeRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.river():
            geometry = self.assert_is_line_string(geometry)
            return RiverBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[RiverRawDataItem.default(date_time=start_date_time)],
            )

        if boundary_type == BoundaryType.well():
            geometry = self.assert_is_point(geometry)
            return WellBoundary.new(
                boundary_id=boundary_id,
                name=name if name else BoundaryName.from_str(value=f'new {boundary_type.to_str()} boundary'),
                tags=tags if tags else BoundaryTags.empty(),
                geometry=geometry,
                affected_layers=affected_layers,
                affected_cells=affected_cells,
                data=[WellRawDataItem.default(date_time=start_date_time)],
            )

        return None
