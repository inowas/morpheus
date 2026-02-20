from morpheus.project.types.boundaries.Boundary import BoundaryType
from morpheus.project.types.boundaries.ConstantHeadObservation import ConstantHeadObservation, ConstantHeadObservationValue
from morpheus.project.types.boundaries.DrainObservation import DrainObservation, DrainRawDataItem
from morpheus.project.types.boundaries.EvapotranspirationObservation import EvapotranspirationObservation, EvapotranspirationObservationValue
from morpheus.project.types.boundaries.FlowAndHeadObservation import FlowAndHeadObservation, FlowAndHeadRawDataItem
from morpheus.project.types.boundaries.GeneralHeadObservation import GeneralHeadObservation, GeneralHeadRawDataItem
from morpheus.project.types.boundaries.LakeObservation import BedLeakance, InitialStage, LakeObservation, LakeObservationValue, StageRange
from morpheus.project.types.boundaries.Observation import Observation, ObservationId, ObservationName
from morpheus.project.types.boundaries.RechargeObservation import RechargeObservation, RechargeObservationValue
from morpheus.project.types.boundaries.RiverObservation import RiverObservation, RiverObservationValue
from morpheus.project.types.boundaries.WellObservation import WellObservation, WellObservationValue
from morpheus.project.types.geometry import Point


class ObservationFactory:
    @staticmethod
    def new(boundary_type: BoundaryType, observation_name: ObservationName, observation_geometry: Point, observation_data: list, observation_id: ObservationId) -> Observation:
        if boundary_type == BoundaryType.constant_head:
            return ConstantHeadObservation.new(
                name=observation_name,
                geometry=observation_geometry,
                data=[ConstantHeadObservationValue.from_dict(item) for item in observation_data],
                observation_id=observation_id,
            )
        if boundary_type == BoundaryType.drain:
            return DrainObservation.new(name=observation_name, geometry=observation_geometry, data=[DrainRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.evapotranspiration:
            return EvapotranspirationObservation.new(
                name=observation_name, geometry=observation_geometry, data=[EvapotranspirationObservationValue.from_dict(item) for item in observation_data]
            )
        if boundary_type == BoundaryType.flow_and_head:
            return FlowAndHeadObservation.new(name=observation_name, geometry=observation_geometry, data=[FlowAndHeadRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.general_head:
            return GeneralHeadObservation.new(name=observation_name, geometry=observation_geometry, data=[GeneralHeadRawDataItem.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.lake:
            return LakeObservation.new(
                name=observation_name,
                geometry=observation_geometry,
                data=[LakeObservationValue.from_dict(item) for item in observation_data],
                bed_leakance=BedLeakance.from_value(100),
                initial_stage=InitialStage.from_float(1.0),
                stage_range=StageRange(min=0.0, max=1.0),
            )
        if boundary_type == BoundaryType.recharge:
            return RechargeObservation.new(name=observation_name, geometry=observation_geometry, data=[RechargeObservationValue.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.river:
            return RiverObservation.new(name=observation_name, geometry=observation_geometry, data=[RiverObservationValue.from_dict(item) for item in observation_data])
        if boundary_type == BoundaryType.well:
            return WellObservation.new(name=observation_name, geometry=observation_geometry, data=[WellObservationValue.from_dict(item) for item in observation_data])

        raise ValueError(f'Unknown boundary type: {boundary_type.to_str()}')

    @staticmethod
    def from_dict(boundary_type: BoundaryType, data: dict) -> Observation:
        if boundary_type == BoundaryType.constant_head:
            return ConstantHeadObservation.from_dict(data)
        if boundary_type == BoundaryType.drain:
            return DrainObservation.from_dict(data)
        if boundary_type == BoundaryType.evapotranspiration:
            return EvapotranspirationObservation.from_dict(data)
        if boundary_type == BoundaryType.flow_and_head:
            return FlowAndHeadObservation.from_dict(data)
        if boundary_type == BoundaryType.general_head:
            return GeneralHeadObservation.from_dict(data)
        if boundary_type == BoundaryType.lake:
            return LakeObservation.from_dict(data)
        if boundary_type == BoundaryType.recharge:
            return RechargeObservation.from_dict(data)
        if boundary_type == BoundaryType.river:
            return RiverObservation.from_dict(data)
        if boundary_type == BoundaryType.well:
            return WellObservation.from_dict(data)

        raise ValueError(f'Unknown boundary type: {boundary_type.to_str()}')
