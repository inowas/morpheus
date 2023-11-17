import dataclasses

from . import FlopyModflow
from ....types.ModflowModel import ModflowModel
from ....types.calculation.Calculation import CalculationProfile


@dataclasses.dataclass
class MfPackageData:
    modelname: str = 'model'
    namefile_ext: str = 'nam'
    version: str = 'mf2005'
    exe_name: str = 'mf2005'
    structured: bool = True
    listunit: int = 2
    model_ws: str = '.'
    external_path: str | None = None
    verbose: bool = False

    @staticmethod
    def custom_defaults() -> dict:
        return {}

    def with_custom_values(self, custom_values: dict):
        return MfPackageData(**{**dataclasses.asdict(self), **custom_values})

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def create_mf_package_data(modflow_model: ModflowModel, custom_values: dict) -> MfPackageData:
    mf_package_data = MfPackageData(
        modelname=modflow_model.name.to_str(),
        namefile_ext='nam',
        version='mf2005',
        exe_name='mf2005',
        structured=True,
        listunit=2,
        model_ws='.',
        external_path=None,
        verbose=False
    ).with_custom_values(custom_values)
    return mf_package_data


def create_mf_package(modflow_model: ModflowModel, calculation_profile: CalculationProfile) -> FlopyModflow:
    custom_values = calculation_profile.get_package_data('mf')
    mf_package_data = create_mf_package_data(modflow_model, custom_values)
    return FlopyModflow(**mf_package_data.to_dict())
