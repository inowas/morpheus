import dataclasses
from typing import Literal

from flopy.modflow import ModflowHob as FlopyModflowHob
from flopy.modflow import HeadObservation as FlopyModflowHeadObservation

from .HobPackageMapper import calculate_observation_items, HeadObservationData, HeadObservationItem
from ...modflow_2005 import FlopyModflow
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class HobPackageSettings:

    def __init__(self):
        pass

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls()

    def to_dict(self) -> dict:
        return {}


@dataclasses.dataclass
class HobPackageData:
    head_observation_data: HeadObservationData
    # if greater than zero, then hob.out will be written
    iuhobsv: int
    hobdry: float
    tomulth: float
    hobname: str | None
    extension: Literal["hob"]
    no_print: bool
    options: None | list
    unitnumber: None | int
    filenames: None | str | list[str]

    def __init__(self, head_observation_data: HeadObservationData, iuhobsv: int = 1, hobdry: float = 0.0,
                 tomulth: float = 1.0, hobname: str | None = None, extension: Literal["hob"] = "hob",
                 no_print: bool = False, options: None | list = None, unitnumber: int | None = None,
                 filenames: None | str | list[str] = None):
        self.head_observation_data = head_observation_data
        self.iuhobsv = iuhobsv
        self.hobdry = hobdry
        self.tomulth = tomulth
        self.hobname = hobname
        self.extension = extension
        self.no_print = no_print
        self.options = options
        self.unitnumber = unitnumber
        self.filenames = filenames

    def to_dict(self) -> dict:
        return {
            'iuhobsv': self.iuhobsv,
            'hobdry': self.hobdry,
            'tomulth': self.tomulth,
            'hobname': self.hobname,
            'extension': self.extension,
            'no_print': self.no_print,
            'options': self.options,
            'unitnumber': self.unitnumber,
            'filenames': self.filenames
        }


def calculate_hob_package_data(model: Model, settings: HobPackageSettings) -> HobPackageData | None:
    if len(model.observations) == 0:
        return None

    head_observation_data = calculate_observation_items(model)
    if head_observation_data.is_empty():
        return None

    return HobPackageData(head_observation_data=head_observation_data)


def create_hob_package(flopy_modflow: FlopyModflow, model: Model, settings: HobPackageSettings) -> FlopyModflowHob | None:
    package_data = calculate_hob_package_data(model=model, settings=settings)
    if package_data is None:
        return None

    obs_data = []
    for item in package_data.head_observation_data:
        if not isinstance(item, HeadObservationItem):
            continue

        obs_data.append(FlopyModflowHeadObservation(
            model=flopy_modflow,
            obsname=item.name,
            layer=item.layer,
            row=item.row,
            column=item.column,
            time_series_data=[item.to_list() for item in item.time_series_data]
        ))

    return FlopyModflowHob(model=flopy_modflow, obs_data=obs_data, **package_data.to_dict())
