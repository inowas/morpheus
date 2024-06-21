from enum import StrEnum


class CalculationEventName(StrEnum):
    CALCULATION_PROFILE_ADDED = 'Calculation Profile Added'
    CALCULATION_PROFILE_DELETED = 'Calculation Profile Deleted'
    CALCULATION_PROFILE_REMOVED = 'Calculation Profile Removed'

    def to_str(self):
        return self.value
