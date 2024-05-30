from morpheus.project.types.boundaries.Boundary import BoundaryType
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadRawDataItem, ConstantHeadObservation
from morpheus.project.types.boundaries.DrainObservation import DrainRawDataItem, DrainObservation
from morpheus.project.types.boundaries.EvapotranspirationObservation import EvapotranspirationRawDataItem, EvapotranspirationObservation
from morpheus.project.types.boundaries.FlowAndHeadObservation import FlowAndHeadRawDataItem, FlowAndHeadObservation
from morpheus.project.types.boundaries.GeneralHeadObservation import GeneralHeadRawDataItem, GeneralHeadObservation
from morpheus.project.types.boundaries.LakeObservation import LakeRawDataItem, LakeObservation, BedLeakance, InitialStage, StageRange
from morpheus.project.types.boundaries.Observation import Observation, ObservationName
from morpheus.project.types.boundaries.RechargeObservation import RechargeRawDataItem, RechargeObservation
from morpheus.project.types.boundaries.RiverObservation import RiverRawDataItem, RiverObservation
from morpheus.project.types.boundaries.WellObservation import WellRawDataItem, WellObservation
from morpheus.project.types.geometry import Point


class ObservationFactory:

    @staticmethod
    def new(boundary_type: BoundaryType, observation_name: ObservationName, observation_geometry: Point, observation_data: list):
        if boundary_type == BoundaryType.constant_head():
            return ConstantHeadObservation.new(name=observation_name, geometry=observation_geometry, data=[ConstantHeadRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.drain():
            return DrainObservation.new(name=observation_name, geometry=observation_geometry, data=[DrainRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.evapotranspiration():
            return EvapotranspirationObservation.new(name=observation_name, geometry=observation_geometry,
                                                     data=[EvapotranspirationRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.flow_and_head():
            return FlowAndHeadObservation.new(name=observation_name, geometry=observation_geometry, data=[FlowAndHeadRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.general_head():
            return GeneralHeadObservation.new(name=observation_name, geometry=observation_geometry, data=[GeneralHeadRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.lake():
            return LakeObservation.new(name=observation_name, geometry=observation_geometry, data=[LakeRawDataItem.from_dict(item) for item in observation_data],
                                       bed_leakance=BedLeakance.from_value(100), initial_stage=InitialStage.from_float(1.0),
                                       stage_range=StageRange(min=0.0, max=1.0))
        if boundary_type == BoundaryType.recharge():
            return RechargeObservation.new(name=observation_name, geometry=observation_geometry, data=[RechargeRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.river():
            return RiverObservation.new(name=observation_name, geometry=observation_geometry, data=[RiverRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.well():
            return WellObservation.new(name=observation_name, geometry=observation_geometry, data=[WellRawDataItem.from_dict(item) for item in observation_data])

        raise ValueError(f'Unknown boundary type: {boundary_type.to_str()}')

    @staticmethod
    def from_dict(boundary_type: BoundaryType, data: dict) -> Observation:
        if boundary_type == BoundaryType.constant_head():
            return ConstantHeadObservation.from_dict(data)
        if boundary_type == BoundaryType.drain():
            return DrainObservation.from_dict(data)
        if boundary_type == BoundaryType.evapotranspiration():
            return EvapotranspirationObservation.from_dict(data)
        if boundary_type == BoundaryType.flow_and_head():
            return FlowAndHeadObservation.from_dict(data)
        if boundary_type == BoundaryType.general_head():
            return GeneralHeadObservation.from_dict(data)
        if boundary_type == BoundaryType.lake():
            return LakeObservation.from_dict(data)
        if boundary_type == BoundaryType.recharge():
            return RechargeObservation.from_dict(data)
        if boundary_type == BoundaryType.river():
            return RiverObservation.from_dict(data)
        if boundary_type == BoundaryType.well():
            return WellObservation.from_dict(data)

        raise ValueError(f'Unknown boundary type: {boundary_type.to_str()}')
