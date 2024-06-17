import dataclasses
from typing import Literal

from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.De4PackageWrapper import De4PackageData
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GmgPackageWrapper import GmgPackageData
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.OcPackageWrapper import OcPackageData
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgPackageWrapper import PcgPackageData
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgnPackageWrapper import PcgnPackageData
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.SipPackageWrapper import SipPackageData


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
    data: De4PackageData | GmgPackageData | PcgPackageData | PcgnPackageData | SipPackageData = dataclasses.field(default_factory=PcgPackageData)

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


@dataclasses.dataclass(frozen=True)
class Mf2005CalculationEngineSettings(CalculationEngineSettingsBase):
    packages: PackageData = dataclasses.field(default_factory=PackageData)

    def get_oc_package_data(self) -> OcPackageData:
        return self.packages.oc

    def get_flow_package_data(self) -> FlowPackage:
        return self.packages.flow_package

    def get_solver_package_data(self) -> SolverPackageData:
        return self.packages.solver_package

    @classmethod
    def default(cls):
        return cls(
            packages=PackageData.default()
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            packages=PackageData.from_dict(obj['packages'])
        )

    def to_dict(self) -> dict:
        return {
            'packages': self.packages.to_dict()
        }
