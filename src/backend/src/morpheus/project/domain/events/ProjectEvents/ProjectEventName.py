from enum import StrEnum


class ProjectEventName(StrEnum):
    PROJECT_CREATED = 'Project Created'
    PROJECT_DELETED = 'Project Deleted'
    PROJECT_METADATA_UPDATED = 'Project Metadata Updated'
    PROJECT_PREVIEW_IMAGE_UPDATED = 'Project Preview Image Updated'
    PROJECT_PREVIEW_IMAGE_DELETED = 'Project Preview Image Deleted'

    def to_str(self):
        return self.value
