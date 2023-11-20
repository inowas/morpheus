import dataclasses


@dataclasses.dataclass
class GridCell:
    x: int
    y: int
    value: bool | float

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            x=obj['x'],
            y=obj['y'],
            value=obj['value']
        )

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'value': self.value
        }


@dataclasses.dataclass
class GridCells:
    shape: tuple[int, int]
    data: list[GridCell]

    @classmethod
    def empty_from_shape(cls, nx: int, ny: int):
        return cls(
            shape=(nx, ny),
            data=[]
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            shape=obj['shape'],
            data=[GridCell.from_dict(cell) for cell in obj['data']]
        )

    def to_dict(self):
        return {
            'shape': self.shape,
            'data': [cell.to_dict() for cell in self.data]
        }

    def get_cell(self, x: int, y: int) -> GridCell | None:
        if x < 0 or x >= self.shape[0] or y < 0 or y >= self.shape[1]:
            return None

        try:
            return next(cell for cell in self.data if cell.x == x and cell.y == y)
        except StopIteration:
            return None

    def set_cell(self, value: bool, x: int, y: int):
        if x < 0 or x >= self.shape[0] or y < 0 or y >= self.shape[1]:
            return

        existing_cell = self.get_cell(x=x, y=y)
        if existing_cell:
            existing_cell.value = value
            return

        self.data.append(GridCell(x=x, y=y, value=value))
