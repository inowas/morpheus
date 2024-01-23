from enum import StrEnum


class ModflowEventName(StrEnum):
    PROJECT_CREATED = 'Project Created'

    def to_str(self):
        return self.value
