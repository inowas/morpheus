from enum import StrEnum


class CalculationEventName(StrEnum):
    CALCULATION_CANCELED = 'Calculation Canceled'
    CALCULATION_COMPLETED = 'Calculation Completed'
    CALCULATION_CREATED = 'Calculation Created'
    CALCULATION_DELETED = 'Calculation Deleted'
    CALCULATION_FAILED = 'Calculation Failed'
    CALCULATION_STARTED = 'Calculation Started'

    CALCULATION_PROFILE_ADDED = 'Calculation Profile Added'
    CALCULATION_PROFILE_DELETED = 'Calculation Profile Deleted'
    CALCULATION_PROFILE_REMOVED = 'Calculation Profile Removed'

    def to_str(self):
        return self.value
