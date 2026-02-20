import dataclasses

from flopy.modflow import Modflow as FlopyModflow

from morpheus.project.types.Model import Model


@dataclasses.dataclass
class MfPackageSettings:
    verbose: bool

    def __init__(self, verbose: bool = False):
        self.verbose = verbose

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclasses.dataclass
class MfPackageData:
    modelname: str
    namefile_ext: str
    version: str
    exe_name: str
    structured: bool
    listunit: int
    model_ws: str
    external_path: str | None
    verbose: bool

    def __init__(
        self,
        modelname: str = 'model',
        namefile_ext: str = 'nam',
        version: str = 'mf2005',
        exe_name: str = 'mf2005',
        structured: bool = True,
        listunit: int = 2,
        model_ws: str = '.',
        external_path: str | None = None,
        verbose: bool = False,
    ):
        self.modelname = modelname
        self.namefile_ext = namefile_ext
        self.version = version
        self.exe_name = exe_name
        self.structured = structured
        self.listunit = listunit
        self.model_ws = model_ws
        self.external_path = external_path
        self.verbose = verbose

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def create_mf_package_data(model: Model, model_name: str, model_ws: str, settings: MfPackageSettings) -> MfPackageData:
    return MfPackageData(modelname=model_name, exe_name='mf2005', model_ws=model_ws, verbose=settings.verbose)


def create_mf_package(model: Model, model_name: str, model_ws: str, settings: MfPackageSettings) -> FlopyModflow:
    package_data = create_mf_package_data(model=model, settings=settings, model_name=model_name, model_ws=model_ws)
    return FlopyModflow(**package_data.to_dict())
