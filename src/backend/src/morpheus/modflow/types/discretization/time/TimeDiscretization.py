import dataclasses

from .Stressperiods import StartDateTime, EndDateTime, StressPeriodCollection
from .TimeUnit import TimeUnit


@dataclasses.dataclass
class TimeDiscretization:
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit

    def __init__(self, start_date_time: StartDateTime, end_date_time: EndDateTime,
                 stress_periods: StressPeriodCollection,
                 time_unit: TimeUnit):
        self.start_date_time = start_date_time
        self.end_date_time = end_date_time
        self.stress_periods = stress_periods
        self.time_unit = time_unit

        if self.start_date_time.to_datetime() > self.end_date_time.to_datetime():
            raise ValueError('Start date must be before end date')

        if self.stress_periods.values[-1].start_date_time.to_datetime() > self.end_date_time.to_datetime():
            raise ValueError('Last stress period must start before end date')

        if self.stress_periods.values[0].start_date_time.to_datetime() != self.start_date_time.to_datetime():
            raise ValueError('First stress period must start at start date')

    @classmethod
    def new(cls):
        start_datetime = StartDateTime.from_str('2020-01-01T00:00:00+00:00')
        end_datetime = EndDateTime.from_str('2020-01-02T00:00:00+00:00')
        return TimeDiscretization(
            start_date_time=start_datetime,
            end_date_time=end_datetime,
            stress_periods=StressPeriodCollection.new(start_date=start_datetime),
            time_unit=TimeUnit.days()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            start_date_time=StartDateTime.from_value(obj['start_datetime']),
            end_date_time=EndDateTime.from_value(obj['end_datetime']),
            stress_periods=StressPeriodCollection.from_value(obj['stress_periods']),
            time_unit=TimeUnit.from_value(obj['time_unit'])
        )

    def to_dict(self):
        return {
            'start_datetime': self.start_date_time.to_value(),
            'end_datetime': self.end_date_time.to_value(),
            'stress_periods': self.stress_periods.to_value(),
            'time_unit': self.time_unit.to_value()
        }

    def number_of_stress_periods(self):
        return len(self.stress_periods)

    def time_unit_length_in_seconds(self):
        if self.time_unit == TimeUnit.seconds():
            return 1
        if self.time_unit == TimeUnit.minutes():
            return 60
        if self.time_unit == TimeUnit.hours():
            return 3600
        if self.time_unit == TimeUnit.days():
            return 86400
        if self.time_unit == TimeUnit.years():
            return 31536000

        raise ValueError('Invalid time unit')

    def number_of_time_steps(self):
        return self.stress_periods.number_of_time_steps()

    def time_step_multipliers(self):
        return self.stress_periods.time_step_multipliers()

    def stress_period_types(self):
        return self.stress_periods.stress_period_types()

    def stress_period_lengths(self):
        for idx, stress_period in enumerate(self.stress_periods):
            start = self.stress_periods.values[idx].start_date_time.to_datetime()
            end = self.stress_periods.values[idx + 1].start_date_time.to_datetime() if idx + 1 < len(
                self.stress_periods.values) else self.end_date_time.to_datetime()
            yield (end - start).total_seconds() / self.time_unit_length_in_seconds()

    def get_start_date_times(self) -> list[StartDateTime]:
        return [stress_period.start_date_time for stress_period in self.stress_periods]

    def get_end_date_times(self) -> list[EndDateTime]:
        start_date_times = self.get_start_date_times()
        end_date_times = []
        for idx, stress_period in enumerate(self.stress_periods):
            if idx + 1 < len(start_date_times):
                end_date_times.append(EndDateTime.from_value(start_date_times[idx + 1].to_value()))
                continue

            end_date_times.append(self.end_date_time)

        return end_date_times
