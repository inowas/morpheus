from morpheus.common.infrastructure.event_sourcing.EventPublisher import listen_to, EventListenerBase
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata
from morpheus.project.domain.events.CalculationEvents.CalculationProfileAddedEvent import CalculationProfileAddedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileRemovedEvent import CalculationProfileRemovedEvent
from morpheus.project.domain.events.CalculationEvents.CalculationProfileUpdatedEvent import CalculationProfileUpdatedEvent

from morpheus.project.domain.events.ProjectEvents.ProjectEvents import ProjectDeletedEvent, ProjectCalculationProfileIdUpdatedEvent
from morpheus.project.infrastructure.persistence.CalculationProfilesRepository import CalculationProfilesRepository, calculation_profiles_repository


class CalculationProfilesProjector(EventListenerBase):

    def __init__(self, calculation_profiles_repo: CalculationProfilesRepository):
        self.calculation_profile_repo = calculation_profiles_repo

    @listen_to(CalculationProfileAddedEvent)
    def on_calculation_profile_added(self, event: CalculationProfileAddedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        calculation_profile = event.get_calculation_profile()
        self.calculation_profile_repo.add_calculation_profile(project_id=project_id, calculation_profile=calculation_profile)

    @listen_to(CalculationProfileRemovedEvent)
    def on_calculation_profile_removed(self, event: CalculationProfileRemovedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        calculation_profile_id = event.get_calculation_profile_id()
        self.calculation_profile_repo.delete_calculation_profile(project_id=project_id, profile_id=calculation_profile_id)

    @listen_to(CalculationProfileUpdatedEvent)
    def on_calculation_profile_updated(self, event: CalculationProfileUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        calculation_profile = event.get_calculation_profile()
        self.calculation_profile_repo.update_calculation_profile(project_id=project_id, calculation_profile=calculation_profile)

    @listen_to(ProjectCalculationProfileIdUpdatedEvent)
    def on_project_calculation_profile_id_updated(self, event: ProjectCalculationProfileIdUpdatedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        calculation_profile_id = event.get_calculation_profile_id()
        self.calculation_profile_repo.update_selected_calculation_profile(project_id=project_id, calculation_profile_id=calculation_profile_id)

    @listen_to(ProjectDeletedEvent)
    def on_project_deleted(self, event: ProjectDeletedEvent, metadata: EventMetadata) -> None:
        project_id = event.get_project_id()
        self.calculation_profile_repo.delete_all(project_id=project_id)


calculation_profiles_projector = CalculationProfilesProjector(calculation_profiles_repo=calculation_profiles_repository)
