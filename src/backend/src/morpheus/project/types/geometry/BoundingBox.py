import dataclasses


@dataclasses.dataclass(frozen=True)
class BoundingBox:
    min_x: float
    min_y: float
    max_x: float
    max_y: float

    def __post_init__(self):
        if self.min_x >= self.max_x:
            raise ValueError('min_x must be less than max_x')
        if self.min_y >= self.max_y:
            raise ValueError('min_y must be less than max_y')

    @classmethod
    def from_tuple_of_points(cls, tuple_of_points: tuple[tuple[float, float], tuple[float, float]]):
        """Expects a tuple of two points, both in form (x, y).

            Example:

            BoundingBox.from_tuple_of_points(((1.1, 0.2), (0.1, 1.2)))

            This will create a BoundingBox with min_x=0.1, min_y=0.2, max_x=1.1, max_y=1.2
            """

        (x1, y1), (x2, y2) = tuple_of_points
        return cls(min_x=min(x1, x2), min_y=min(y1, y2), max_x=max(x1, x2), max_y=max(y1, y2))

    @classmethod
    def from_tuple_of_coordinates(cls, tuple_of_coordinates: tuple[float, float, float, float]):
        """Expects a tuple of four coordinates, the first being min_x, the second being  min_y, the third being max_x and the fourth being max_y.

            Example:

            BoundingBox.from_tuple_of_coordinates((0.1, 0.2, 1.1, 1.2))

            This will create a BoundingBox with min_x=0.1, min_y=0.2, max_x=1.1, max_y=1.2
            """

        return cls(min_x=tuple_of_coordinates[0], min_y=tuple_of_coordinates[1], max_x=tuple_of_coordinates[2], max_y=tuple_of_coordinates[3])

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(min_x=obj['min_x'], min_y=obj['min_y'], max_x=obj['max_x'], max_y=obj['max_y'])

    def to_dict(self):
        return dataclasses.asdict(self)
