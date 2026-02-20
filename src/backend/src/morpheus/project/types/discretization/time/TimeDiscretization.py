import dataclasses
from collections.abc import Iterator

from morpheus.common.types import DateTime

from .Stressperiods import EndDateTime, StartDateTime, StressPeriodCollection
from .TimeUnit import TimeUnit


@dataclasses.dataclass
class TimeDiscretization:
    start_date_time: StartDateTime
    end_date_time: EndDateTime
    stress_periods: StressPeriodCollection
    time_unit: TimeUnit

    def __init__(self, start_date_time: StartDateTime, end_date_time: EndDateTime, stress_periods: StressPeriodCollection, time_unit: TimeUnit):
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
        start_date_time = StartDateTime.from_str('2020-01-01T00:00:00+00:00')
        end_date_time = EndDateTime.from_str('2020-01-02T00:00:00+00:00')
        return TimeDiscretization(
            start_date_time=start_date_time, end_date_time=end_date_time, stress_periods=StressPeriodCollection.new(start_date=start_date_time), time_unit=TimeUnit.days()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            start_date_time=StartDateTime.from_value(obj['start_date_time']),
            end_date_time=EndDateTime.from_value(obj['end_date_time']),
            stress_periods=StressPeriodCollection.from_value(obj['stress_periods']),
            time_unit=TimeUnit.from_value(obj['time_unit']),
        )

    def to_dict(self):
        return {
            'start_date_time': self.start_date_time.to_value(),
            'end_date_time': self.end_date_time.to_value(),
            'stress_periods': self.stress_periods.to_value(),
            'time_unit': self.time_unit.to_value(),
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

    def stress_period_lengths(self) -> Iterator[float]:
        values = self.stress_periods.values
        unit_length = self.time_unit_length_in_seconds()

        for i in range(len(values)):
            start = values[i].start_date_time.to_datetime()
            end = values[i + 1].start_date_time.to_datetime() if i + 1 < len(values) else self.end_date_time.to_datetime()
            yield (end - start).total_seconds() / unit_length

    def get_start_date_times(self) -> list[StartDateTime]:
        return [stress_period.start_date_time for stress_period in self.stress_periods]

    def get_end_date_times(self) -> list[EndDateTime]:
        start_date_times = self.get_start_date_times()
        last_index = len(start_date_times) - 1

        end_date_times: list[EndDateTime] = []

        for idx in range(len(self.stress_periods)):
            if idx < last_index:
                next_start = start_date_times[idx + 1]
                end_date_times.append(EndDateTime.from_value(next_start.to_value()))
            else:
                end_date_times.append(self.end_date_time)

        return end_date_times

    def get_total_time_from_date_time(self, date_time: DateTime) -> float:
        total_time_in_seconds = date_time.to_datetime().timestamp() - self.start_date_time.to_datetime().timestamp()
        return total_time_in_seconds / self.time_unit_length_in_seconds()
