import dataclasses
from typing import Literal

from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.De4PackageWrapper import De4PackageData
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.GmgPackageWrapper import GmgPackageData
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.OcPackageWrapper import OcPackageData
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.PcgPackageWrapper import PcgPackageData
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.PcgnPackageWrapper import PcgnPackageData
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.SipPackageWrapper import SipPackageData
from morpheus.modflow.infrastructure.calculation.types.CalculationProfileBase import CalculationProfileBase


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

    @classmethod
    def default(cls):
        return cls(type='lpf')


@dataclasses.dataclass
class SolverPackageData:
    """
    Solver packages for MODFLOW-2005
    https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/solvers.html

    TODO: Add support for other solver packages
    SIP: https://water.usgs.gov/ogw/modflow/MODFLOW-2005-Guide/sip.html
    """
    type: Literal['de4', 'gmg', 'pcg', 'pcgn', 'sip'] = 'pcg'
    data: De4PackageData | GmgPackageData | PcgPackageData | PcgnPackageData | SipPackageData = dataclasses.field(
        default_factory=PcgPackageData)

    def to_dict(self) -> dict:
        return {
            'type': self.type,
            'data': self.data.to_dict()
        }

    @classmethod
    def default(cls):
        return cls(
            type='pcg',
            data=PcgPackageData()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        ptype = obj.get('type', None)
        if ptype not in list(cls.available_solver_packages().keys()):
            raise ValueError(f'Unknown solver package type: {obj["type"]}')

        if ptype == 'de4':
            return cls(
                type=ptype,
                data=De4PackageData.from_dict(obj['data'])
            )

        if ptype == 'gmg':
            return cls(
                type=ptype,
                data=GmgPackageData.from_dict(obj['data'])
            )

        if ptype == 'pcg':
            return cls(
                type=ptype,
                data=PcgPackageData.from_dict(obj['data'])
            )

        if ptype == 'pcgn':
            return cls(
                type=ptype,
                data=PcgnPackageData.from_dict(obj['data'])
            )

        if ptype == 'sip':
            return cls(
                type=ptype,
                data=SipPackageData.from_dict(obj['data'])
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
    oc: OcPackageData = dataclasses.field(default_factory=OcPackageData)
    flow_package: FlowPackage = dataclasses.field(default_factory=FlowPackage)
    solver_package: SolverPackageData = dataclasses.field(default_factory=SolverPackageData)

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

    @classmethod
    def default(cls):
        return cls(
            oc=OcPackageData.default(),
            flow_package=FlowPackage.default(),
            solver_package=SolverPackageData.default()
        )


@dataclasses.dataclass
class Mf2005CalculationProfile(CalculationProfileBase):
    calculation_type = 'mf2005'
    profile_type = 'default'
    name = 'Modflow 2005 default calculation profile'
    description = 'Modflow 2005 default calculation profile'
    packages: PackageData

    def __init__(self, name: str, description: str, packages: dict):
        self.name = name if name is not None else self.name
        self.description = description
        self.packages = PackageData.from_dict(packages)

    def get_oc_package_data(self) -> OcPackageData:
        return self.packages.oc

    def get_flow_package_data(self) -> FlowPackage:
        return self.packages.flow_package

    def get_solver_package_data(self) -> SolverPackageData:
        return self.packages.solver_package

    @classmethod
    def new(cls):
        return cls(
            name=cls.name,
            description=cls.description,
            packages=PackageData.default().to_dict()
        )

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