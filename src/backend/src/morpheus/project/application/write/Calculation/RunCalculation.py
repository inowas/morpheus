import dataclasses

from morpheus.common.types import DateTime
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.application.write.CommandHandlerBase import CommandHandlerBase
from morpheus.project.domain.events.CalculationEvents import CalculationStartedEvent, CalculationCompletedEvent, CalculationFailedEvent, CalculationPreprocessedEvent
from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from morpheus.project.infrastructure.event_sourcing.ProjectEventBus import project_event_bus
from morpheus.project.infrastructure.persistence.CalculationInputRepository import get_calculation_input_repository
from morpheus.project.infrastructure.persistence.CalculationRepository import get_calculation_repository
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, CalculationState


@dataclasses.dataclass(frozen=True)
class RunCalculationCommand:
    project_id: ProjectId
    calculation_id: CalculationId
    force: bool = False

    @classmethod
    def from_calculation_id(cls, project_id: ProjectId, calculation_id: CalculationId, force: bool = False):
        return cls(
            project_id=project_id,
            calculation_id=calculation_id,
            force=force
        )


class RunCalculationCommandHandler(CommandHandlerBase):
    @staticmethod
    def handle(command: RunCalculationCommand):
        project_id = command.project_id
        calculation_id = command.calculation_id
        force = command.force

        calculation_input = get_calculation_input_repository().get_calculation_input(calculation_id=calculation_id, project_id=project_id)
        if calculation_input is None:
            raise ValueError(f'Calculation {calculation_id.to_str()} not found')

        # check the state of the calculation
        # if the calculation is already in progress, we can't run it again except if force is True
        calculation = get_calculation_repository().get_calculation(project_id=project_id, calculation_id=calculation_id)
        state = calculation.state if calculation is not None else CalculationState.CREATED

        if force:
            state = CalculationState.CREATED

        if state != CalculationState.CREATED:
            raise Exception('Calculation was already run or is still in progress')

        event = CalculationStartedEvent.from_calculation_id(project_id=project_id, calculation_id=calculation_id, occurred_at=DateTime.now())

        #  Todo! here we need a metadata object without user_id
        event_metadata = EventMetadata.without_creator()
        event_envelope = EventEnvelope(event=event, metadata=event_metadata)
        project_event_bus.record(event_envelope=event_envelope)

        model = calculation_input.model
        profile = calculation_input.profile
        engine = CalculationEngineFactory().create_engine(calculation_id=calculation_id, profile=profile)

        # Preprocessing
        try:
            check_model_log = engine.preprocess(model=model, calculation_profile=profile)
            event = CalculationPreprocessedEvent.from_log_and_result(
                project_id=project_id,
                calculation_id=calculation_id,
                check_model_log=check_model_log,
                occurred_at=DateTime.now()
            )

            event_metadata = EventMetadata.without_creator()
            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)
        except Exception as e:
            event = CalculationFailedEvent.with_message(
                project_id=project_id,
                calculation_id=calculation_id,
                message=str(e),
                occurred_at=DateTime.now()
            )
            event_metadata = EventMetadata.without_creator()
            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)

        # Calculation
        try:
            calculation_log, result = engine.run(model=model, calculation_profile=profile)
            event = CalculationCompletedEvent.from_log_and_result(
                project_id=project_id,
                calculation_id=calculation_id,
                calculation_log=calculation_log,
                result=result,
                occurred_at=DateTime.now()
            )

            event_metadata = EventMetadata.without_creator()
            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)
        except Exception as e:
            event = CalculationFailedEvent.with_message(
                project_id=project_id,
                calculation_id=calculation_id,
                message=str(e),
                occurred_at=DateTime.now()
            )
            event_metadata = EventMetadata.without_creator()
            event_envelope = EventEnvelope(event=event, metadata=event_metadata)
            project_event_bus.record(event_envelope=event_envelope)
