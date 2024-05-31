from enum import StrEnum


class CalculationEventName(StrEnum):
    CALCULATION_CANCELED = 'Calculation Canceled'
    CALCULATION_COMPLETED = 'Calculation Completed'
    CALCULATION_FAILED = 'Calculation Failed'
    CALCULATION_QUEUED = 'Calculation Queued'
    CALCULATION_STARTED = 'Calculation Started'

    def to_str(self):
        return self.value
