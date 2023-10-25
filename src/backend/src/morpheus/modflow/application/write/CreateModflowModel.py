import dataclasses


@dataclasses.dataclass(frozen=True)
class CreateModflowModelCommand:
    id: str
    name: str
    description: str
    model_area: dict
    bounding_box: dict
    grid: dict
    cells: dict
    rotation: float
    stress_periods: list[dict]
    length_unit: int
    time_unit: int
    # everything accepted by pyproj.CRS.from_user_input(),
    crs: str

    @staticmethod
    def message_name():
        return 'create_modflow_model'

    @classmethod
    def from_dict(cls, dictionary: dict):
        return cls(
            id=dictionary['id'],
            name=dictionary['name'],
            description=dictionary['description'],
            model_area=dictionary['model_area'],
            bounding_box=dictionary['bounding_box'],
            grid=dictionary['grid'],
            cells=dictionary['cells'],
            rotation=dictionary['rotation'],
            stress_periods=dictionary['stress_periods'],
            length_unit=dictionary['length_unit'],
            time_unit=dictionary['time_unit'],
            crs=dictionary['crs']
        )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'model_area': self.model_area,
            'bounding_box': self.bounding_box,
            'grid': self.grid,
            'cells': self.cells,
            'rotation': self.rotation,
            'stress_periods': self.stress_periods,
            'length_unit': self.length_unit,
            'time_unit': self.time_unit,
            'crs': self.crs
        }


@dataclasses.dataclass
class CreateModflowModelCommandResult:
    id: str


class CreateModflowModelCommandHandler:

    @staticmethod
    def handle(command: CreateModflowModelCommand):
        return CreateModflowModelCommandResult(id=command.id)
