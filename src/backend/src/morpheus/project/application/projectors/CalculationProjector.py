from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.domain.events.CalculationEvents import CalculationStartedEvent, CalculationQueuedEvent, CalculationCreatedEvent, CalculationPreprocessedEvent, CalculationCompletedEvent, \
    CalculationFailedEvent, CalculationDeletedEvent, CalculationCanceledEvent

from morpheus.project.infrastructure.persistence.CalculationRepository import CalculationRepository, calculation_repository
from morpheus.project.types.calculation.Calculation import CalculationState


class CalculationProjector(EventListenerBase):

    def __init__(self, calculation_repo: CalculationRepository):
        self.calculation_repo = calculation_repo

    @listen_to(CalculationCreatedEvent)
    def on_calculation_created(self, event: CalculationCreatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        calculation_id = event.get_calculation_id()
        occurred_at = event.get_occurred_at().to_datetime()
        self.calculation_repo.create_calculation(
            project_id=project_id,
            calculation_id=calculation_id,
            model_id=event.get_model_id(),
            model_hash=event.get_model_hash(),
            model_version=event.get_model_version(),
            profile=event.get_profile(),
            created_at=occurred_at
        )

    @listen_to(CalculationQueuedEvent)
    def on_calculation_queued(self, event: CalculationQueuedEvent, metadata: EventMetadata) -> None:
        calculation = self.calculation_repo.get_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())
        if calculation is None:
            return
        calculation = calculation.with_updated_state(state=CalculationState.QUEUED)
        occurred_at = event.get_occurred_at().to_datetime()
        self.calculation_repo.update_calculation(calculation=calculation, updated_at=occurred_at)

    @listen_to(CalculationStartedEvent)
    def on_calculation_started(self, event: CalculationStartedEvent, metadata: EventMetadata) -> None:
        calculation = self.calculation_repo.get_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())
        if calculation is None:
            return
        calculation = calculation.with_updated_state(state=CalculationState.PREPROCESSING)
        occurred_at = event.get_occurred_at().to_datetime()
        self.calculation_repo.update_calculation(calculation=calculation, updated_at=occurred_at)

    @listen_to(CalculationPreprocessedEvent)
    def on_calculation_preprocessed(self, event: CalculationPreprocessedEvent, metadata: EventMetadata) -> None:
        calculation = self.calculation_repo.get_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())
        if calculation is None:
            return
        calculation = calculation.with_updated_state(state=CalculationState.CALCULATING)
        calculation = calculation.with_updated_check_model_log(check_model_log=event.get_check_model_log())
        occurred_at = event.get_occurred_at().to_datetime()

        self.calculation_repo.update_calculation(calculation=calculation, updated_at=occurred_at)

    @listen_to(CalculationCompletedEvent)
    def on_calculation_completed(self, event: CalculationCompletedEvent, metadata: EventMetadata) -> None:
        calculation = self.calculation_repo.get_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())
        if calculation is None:
            return
        calculation = calculation.with_updated_state(state=CalculationState.COMPLETED)
        calculation = calculation.with_updated_calculation_log(calculation_log=event.get_calculation_log())
        calculation = calculation.with_updated_result(result=event.get_result())
        occurred_at = event.get_occurred_at().to_datetime()

        self.calculation_repo.update_calculation(calculation=calculation, updated_at=occurred_at)

    @listen_to(CalculationFailedEvent)
    def on_calculation_failed(self, event: CalculationFailedEvent, metadata: EventMetadata) -> None:
        calculation = self.calculation_repo.get_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())
        if calculation is None:
            return
        calculation = calculation.with_updated_state(state=CalculationState.FAILED)
        calculation = calculation.with_updated_calculation_log(calculation_log=event.get_error_log())
        occurred_at = event.get_occurred_at().to_datetime()

        self.calculation_repo.update_calculation(calculation=calculation, updated_at=occurred_at)

    @listen_to(CalculationCanceledEvent)
    def on_calculation_cancelled(self, event: CalculationFailedEvent, metadata: EventMetadata) -> None:
        calculation = self.calculation_repo.get_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())
        if calculation is None:
            return

        has_been_finished = calculation.state in {CalculationState.CANCELED, CalculationState.COMPLETED, CalculationState.FAILED}
        if has_been_finished:
            return
        calculation = calculation.with_updated_state(state=CalculationState.CANCELED)
        calculation = calculation.with_updated_calculation_log(calculation_log=event.get_error_log())
        occurred_at = event.get_occurred_at().to_datetime()

        self.calculation_repo.update_calculation(calculation=calculation, updated_at=occurred_at)

    @listen_to(CalculationDeletedEvent)
    def on_calculation_deleted(self, event: CalculationDeletedEvent, metadata: EventMetadata) -> None:
        self.calculation_repo.delete_calculation(project_id=event.get_project_id(), calculation_id=event.get_calculation_id())


calculation_projector = CalculationProjector(calculation_repo=calculation_repository)
