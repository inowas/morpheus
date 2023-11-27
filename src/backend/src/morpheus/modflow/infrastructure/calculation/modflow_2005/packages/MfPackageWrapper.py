import dataclasses
from flopy.modflow import Modflow as FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


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

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)


def create_mf_package_data(modflow_model: ModflowModel) -> MfPackageData:
    mf_package_data = MfPackageData(
        modelname=modflow_model.model_id.to_str(),
        namefile_ext='nam',
        version='mf2005',
        exe_name='mf2005',
        structured=True,
        listunit=2,
        model_ws='.',
        external_path=None,
        verbose=False
    )

    return mf_package_data


def create_mf_package(modflow_model: ModflowModel) -> FlopyModflow:
    mf_package_data = create_mf_package_data(modflow_model)
    return FlopyModflow(
        modelname=mf_package_data.modelname,
        namefile_ext=mf_package_data.namefile_ext,
        version=mf_package_data.version,
        exe_name=mf_package_data.exe_name,
        structured=mf_package_data.structured,
        listunit=mf_package_data.listunit,
        model_ws=mf_package_data.model_ws,
        external_path=mf_package_data.external_path,
        verbose=mf_package_data.verbose,
    )
