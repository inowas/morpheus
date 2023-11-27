import dataclasses

from flopy.modflow import ModflowDe4 as FlopyModflowDe4

from morpheus.modflow.infrastructure.calculation.modflow_2005 import FlopyModflow
from morpheus.modflow.types.ModflowModel import ModflowModel


@dataclasses.dataclass
class De4PackageData:
    itmx: int = 50,
    mxup: int = 0,
    mxlow: int = 0,
    mxbw: int = 0,
    ifreq: int = 3,
    mutd4: int = 0,
    accl: int = 1.0,
    hclose: float = 1e-5,
    iprd4: int = 1,
    extension: str = "de4",
    unitnumber: int | None = None,
    filenames: list[str] | str | None = None,

    def to_dict(self) -> dict:
        return dataclasses.asdict(self)

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(**obj)


def calculate_de4_package_data(modflow_model: ModflowModel) -> De4PackageData:
    de4_package_data = De4PackageData()
    return de4_package_data


def create_de4_package(flopy_modflow: FlopyModflow, modflow_model: ModflowModel) -> FlopyModflowDe4:
    de4_package_data = calculate_de4_package_data(modflow_model)
    return FlopyModflowDe4(
        model=flopy_modflow,
        itmx=de4_package_data.itmx,
        mxup=de4_package_data.mxup,
        mxlow=de4_package_data.mxlow,
        mxbw=de4_package_data.mxbw,
        ifreq=de4_package_data.ifreq,
        mutd4=de4_package_data.mutd4,
        accl=de4_package_data.accl,
        hclose=de4_package_data.hclose,
        iprd4=de4_package_data.iprd4,
        extension=de4_package_data.extension,
        unitnumber=de4_package_data.unitnumber,
        filenames=de4_package_data.filenames,
    )
