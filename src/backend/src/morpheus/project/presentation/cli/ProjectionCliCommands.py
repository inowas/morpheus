from morpheus.common.infrastructure.cli.io import write_error, write_header, write_info, write_success
from morpheus.common.infrastructure.event_sourcing.EventPublisher import EventPublisher
from morpheus.project.application.projectors.PreviewImageProjector import preview_image_projector
from morpheus.project.application.projectors.ProjectSummaryProjector import project_summary_projector
from morpheus.project.infrastructure.event_sourcing.ProjectEventStore import project_event_store


class ReprojectProjectSummariesCliCommand:
    @staticmethod
    def run():
        publisher_with_only_project_summary_projector = EventPublisher()
        publisher_with_only_project_summary_projector.register(project_summary_projector)

        write_header('Reprojecting project summaries')

        event_envelopes = project_event_store.get_all_events_ordered_by_version()
        write_info(f'Found {len(event_envelopes)} events')

        try:
            project_summary_projector.reset()
            write_info('Reset projection')

            for event_envelope in event_envelopes:
                publisher_with_only_project_summary_projector.publish(event_envelope)

            write_success('Successfully reprojected project summaries')
        except Exception as e:
            write_error(f'Failed to reproject project summaries: {e}')


class ReprojectPreviewImagesCliCommand:
    @classmethod
    def run(cls):
        publisher_with_only_preview_image_projector = EventPublisher()
        publisher_with_only_preview_image_projector.register(preview_image_projector)

        write_header('Reprojecting project preview images')

        event_envelopes = project_event_store.get_all_events_ordered_by_version()
        write_info(f'Found {len(event_envelopes)} events')

        try:
            preview_image_projector.reset()
            write_info('Reset projection')

            for event_envelope in event_envelopes:
                publisher_with_only_preview_image_projector.publish(event_envelope)

            write_success('Successfully reprojected preview images')
        except Exception as e:
            write_error(f'Failed to reproject preview images: {e}')
