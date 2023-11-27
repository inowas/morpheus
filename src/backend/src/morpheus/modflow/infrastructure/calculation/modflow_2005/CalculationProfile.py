import dataclasses
from typing import Literal

from .packages.De4PackageWrapper import De4PackageData
from .packages.OcPackageWrapper import OcPackageData
from .packages.PcgPackageWrapper import PcgPackageData


@dataclasses.dataclass
class FlowPackage:
    """
    Groundwater flow packages for MODFLOW-2005
    https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/ground-water_flow_packages.html
    """
    type: Literal['lpf', 'bcf'] = 'lpf'

    available_flow_packages = ['lpf', 'bcf']

    def to_value(self) -> str:
        return self.type

    @classmethod
    def from_value(cls, value: Literal['lpf', 'bcf']):
        if value not in cls.available_flow_packages:
            raise ValueError(f'Unknown flow package type: {value}')

        return cls(type=value)


@dataclasses.dataclass
class SolverPackageData:
    """
    Solver packages for MODFLOW-2005
    https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/solvers.html

    TODO: Add support for other solver packages
    GMG: https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/gmg.html
    LMG: https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/lmg.html
    PCGN: https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/pcgn.html
    SIP: https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/sip.html
    """
    type: Literal['pcg', 'de4'] = 'pcg'
    data: PcgPackageData | De4PackageData = PcgPackageData()

    def to_dict(self) -> dict:
        return {
            'type': self.type,
            'data': self.data.to_dict()
        }

    @classmethod
    def from_dict(cls, obj: dict):
        ptype = obj.get('type', None)
        if ptype not in list(cls.available_solver_packages().keys()):
            raise ValueError(f'Unknown solver package type: {obj["type"]}')

        if ptype == 'pcg':
            return cls(
                type=ptype,
                data=PcgPackageData.from_dict(obj['data'])
            )

        if ptype == 'de4':
            return cls(
                type=ptype,
                data=De4PackageData.from_dict(obj['data'])
            )

        raise ValueError(f'Unknown solver package type: {ptype}')

    @staticmethod
    def available_solver_packages():
        return {
            'pcg': PcgPackageData(),
            'de4': De4PackageData()
        }


@dataclasses.dataclass
class PackageData:
    oc: OcPackageData = OcPackageData()
    flow_package: FlowPackage = FlowPackage()
    solver_package: SolverPackageData = SolverPackageData()

    def to_dict(self) -> dict:
        return {
            'oc': self.oc.to_dict(),
            'flow_package': self.flow_package.to_value(),
            'solver_package': self.solver_package.to_dict()
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            oc=OcPackageData.from_dict(obj['oc']),
            flow_package=FlowPackage.from_value(obj['flow_package']),
            solver_package=SolverPackageData.from_dict(obj['solver_package'])
        )


@dataclasses.dataclass
class Mf2005CalculationProfile:
    calculation_type = 'mf2005'
    profile_type = 'default'

    name = 'Modflow 2005 default calculation profile'
    description = 'Modflow 2005 default calculation profile'
    packages: PackageData = PackageData()

    def __init__(self, name: str, description: str, packages: dict):
        self.name = name
        self.description = description
        self.packages = PackageData.from_dict(packages)

    def get_oc_package_data(self) -> OcPackageData:
        return self.packages.oc

    def get_flow_package_data(self) -> FlowPackage:
        return self.packages.flow_package

    def get_solver_package_data(self) -> SolverPackageData:
        return self.packages.solver_package

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            name=obj['name'],
            description=obj['description'],
            packages=obj['packages']
        )

    def to_dict(self) -> dict:
        return {
            'calculation_type': self.calculation_type,
            'profile_type': self.profile_type,
            'name': self.name,
            'description': self.description,
            'packages': self.packages.to_dict()
        }
