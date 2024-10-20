import dataclasses
from typing import TypedDict, Literal

from morpheus.common.types import Uuid, DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.write.CommandBase import ProjectCommandBase
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.CalculationEvents.CalculationProfileAddedEvent import \
    CalculationProfileAddedEvent
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineSettingsFactory import \
    CalculationEngineSettingsFactory
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile, CalculationProfileId, \
    CalculationProfileName, CalculationEngineType


class AddCalculationProfileCommandPayload(TypedDict):
    project_id: str
    calculation_profile_name: str
    calculation_profile_engine: Literal['mf2005', 'mf6', 'seawat', 'mt3dms']


@dataclasses.dataclass(frozen=True)
class AddCalculationProfileCommand(ProjectCommandBase):
    calculation_profile: CalculationProfile

    @classmethod
    def from_payload(cls, user_id: UserId, payload: dict):
        engine_type = CalculationEngineType(payload['calculation_profile_engine'])
        return cls(
            user_id=user_id,
            project_id=ProjectId.from_str(payload['project_id']),
            calculation_profile=CalculationProfile(
                id=CalculationProfileId.new(),
                name=CalculationProfileName.from_str(payload['calculation_profile_name']),
                engine_type=engine_type,
                engine_settings=CalculationEngineSettingsFactory.create_default_engine_settings(engine_type=engine_type)
            )
        )


class AddCalculationProfileCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: AddCalculationProfileCommand):
        project_id = command.project_id
        user_id = command.user_id

        calculation_profile = command.calculation_profile
        if not isinstance(calculation_profile, CalculationProfile):
            raise ValueError('Calculation profile not found')

        event = CalculationProfileAddedEvent.from_calculation_profile(calculation_profile=calculation_profile, project_id=project_id, occurred_at=DateTime.now())
        event_metadata = EventMetadata.with_creator(user_id=Uuid.from_str(user_id.to_str()))
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)
