from morpheus.common.infrastructure.cli.io import write_success, write_error, write_header, write_info
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.project.application.projectors.ProjectSummaryProjector import ProjectSummaryProjector, project_summary_projector
from morpheus.project.infrastructure.event_sourcing.ProjectEventStore import ProjectEventStore, project_event_store


class ReprojectProjectSummariesCliCommand:
    def __init__(
        self,
        event_store: ProjectEventStore,
        projector: ProjectSummaryProjector,
        publisher: EventPublisher,
    ):
        self.event_store = event_store
        self.projector = projector
        self.publisher = publisher

    @classmethod
    def run(cls):
        publisher_with_only_project_summary_projector = EventPublisher()
        publisher_with_only_project_summary_projector.register(project_summary_projector)

        write_header("Reprojecting project summaries")

        event_envelopes = project_event_store.get_all_events_ordered_by_version()
        write_info(f'Found {len(event_envelopes)} events')

        try:
            project_summary_projector.reset()
            write_info('Reset projector')

            for event_envelope in event_envelopes:
                publisher_with_only_project_summary_projector.publish(event_envelope)

            write_success('Successfully reprojected project summaries')
        except Exception as e:
            write_error(f'Failed to reproject project summaries: {e}')
