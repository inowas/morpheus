from . import ProjectEvents

event_list = [
    ProjectEvents.ProjectCreatedEvent,
    ProjectEvents.ProjectDeletedEvent,
    ProjectEvents.ProjectMetadataUpdatedEvent,
    ProjectEvents.ProjectPreviewImageUpdatedEvent,
    ProjectEvents.ProjectPreviewImageDeletedEvent
]


def get_project_event_list():
    return event_list
