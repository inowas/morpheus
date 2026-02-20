import dataclasses

from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineSettingsBase import CalculationEngineSettingsBase
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.BasPackageWrapper import BasPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.BcfPackageWrapper import BcfPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.ChdPackageWrapper import ChdPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.De4PackageWrapper import De4PackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DisPackageWrapper import DisPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DrnPackageWrapper import DrnPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.EvtPackageWrapper import EvtPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.FhbPackageWrapper import FhbPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GhbPackageWrapper import GhbPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GmgPackageWrapper import GmgPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.HobPackageWrapper import HobPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LakPackageWrapper import LakPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LpfPackageWrapper import LpfPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.MfPackageWrapper import MfPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.OcPackageWrapper import OcPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgnPackageWrapper import PcgnPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgPackageWrapper import PcgPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RchPackageWrapper import RchPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RivPackageWrapper import RivPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.SipPackageWrapper import SipPackageSettings
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.WelPackageWrapper import WelPackageSettings


@dataclasses.dataclass
class Mf2005CalculationEngineSettings(CalculationEngineSettingsBase):
    # general packages
    mf: MfPackageSettings = dataclasses.field(default_factory=MfPackageSettings)
    dis: DisPackageSettings = dataclasses.field(default_factory=DisPackageSettings)
    bas: BasPackageSettings = dataclasses.field(default_factory=BasPackageSettings)

    # boundary packages
    chd: ChdPackageSettings = dataclasses.field(default_factory=ChdPackageSettings)
    drn: DrnPackageSettings = dataclasses.field(default_factory=DrnPackageSettings)
    evt: EvtPackageSettings = dataclasses.field(default_factory=EvtPackageSettings)
    fhb: FhbPackageSettings = dataclasses.field(default_factory=FhbPackageSettings)
    ghb: GhbPackageSettings = dataclasses.field(default_factory=GhbPackageSettings)
    lak: LakPackageSettings = dataclasses.field(default_factory=LakPackageSettings)
    rch: RchPackageSettings = dataclasses.field(default_factory=RchPackageSettings)
    riv: RivPackageSettings = dataclasses.field(default_factory=RivPackageSettings)
    wel: WelPackageSettings = dataclasses.field(default_factory=WelPackageSettings)

    # observation package
    hob: HobPackageSettings = dataclasses.field(default_factory=HobPackageSettings)

    # flow packages
    selected_flow_package: str = dataclasses.field(default='lpf')
    available_flow_packages: list[str] = dataclasses.field(default_factory=lambda: ['lpf', 'bcf'])
    bcf: BcfPackageSettings = dataclasses.field(default_factory=BcfPackageSettings)
    lpf: LpfPackageSettings = dataclasses.field(default_factory=LpfPackageSettings)

    # solver packages
    selected_solver_package: str = dataclasses.field(default='pcg')
    available_solver_packages: list[str] = dataclasses.field(default_factory=lambda: ['de4', 'gmg', 'pcg', 'pcgn', 'sip'])
    de4: De4PackageSettings = dataclasses.field(default_factory=De4PackageSettings)
    gmg: GmgPackageSettings = dataclasses.field(default_factory=GmgPackageSettings)
    pcg: PcgPackageSettings = dataclasses.field(default_factory=PcgPackageSettings)
    pcgn: PcgnPackageSettings = dataclasses.field(default_factory=PcgnPackageSettings)
    sip: SipPackageSettings = dataclasses.field(default_factory=SipPackageSettings)

    # output control package
    oc: OcPackageSettings = dataclasses.field(default_factory=OcPackageSettings)

    @classmethod
    def default(cls):
        return cls()

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            bas=BasPackageSettings.from_dict(obj['bas']) if 'bas' in obj else BasPackageSettings.default(),
            bcf=BcfPackageSettings.from_dict(obj['bcf']) if 'bcf' in obj else BcfPackageSettings.default(),
            chd=ChdPackageSettings.from_dict(obj['chd']) if 'chd' in obj else ChdPackageSettings.default(),
            de4=De4PackageSettings.from_dict(obj['de4']) if 'de4' in obj else De4PackageSettings.default(),
            dis=DisPackageSettings.from_dict(obj['dis']) if 'dis' in obj else DisPackageSettings.default(),
            drn=DrnPackageSettings.from_dict(obj['drn']) if 'drn' in obj else DrnPackageSettings.default(),
            evt=EvtPackageSettings.from_dict(obj['evt']) if 'evt' in obj else EvtPackageSettings.default(),
            fhb=FhbPackageSettings.from_dict(obj['fhb']) if 'fhb' in obj else FhbPackageSettings.default(),
            ghb=GhbPackageSettings.from_dict(obj['ghb']) if 'ghb' in obj else GhbPackageSettings.default(),
            gmg=GmgPackageSettings.from_dict(obj['gmg']) if 'gmg' in obj else GmgPackageSettings.default(),
            hob=HobPackageSettings.from_dict(obj['hob']) if 'hob' in obj else HobPackageSettings.default(),
            lak=LakPackageSettings.from_dict(obj['lak']) if 'lak' in obj else LakPackageSettings.default(),
            lpf=LpfPackageSettings.from_dict(obj['lpf']) if 'lpf' in obj else LpfPackageSettings.default(),
            mf=MfPackageSettings.from_dict(obj['mf']) if 'mf' in obj else MfPackageSettings.default(),
            oc=OcPackageSettings.from_dict(obj['oc']) if 'oc' in obj else OcPackageSettings.default(),
            pcg=PcgPackageSettings.from_dict(obj['pcg']) if 'pcg' in obj else PcgPackageSettings.default(),
            pcgn=PcgnPackageSettings.from_dict(obj['pcgn']) if 'pcgn' in obj else PcgnPackageSettings.default(),
            rch=RchPackageSettings.from_dict(obj['rch']) if 'rch' in obj else RchPackageSettings.default(),
            riv=RivPackageSettings.from_dict(obj['riv']) if 'riv' in obj else RivPackageSettings.default(),
            selected_solver_package=obj.get('selected_solver_package', 'pcg'),
            selected_flow_package=obj['selected_flow_package'],
            sip=SipPackageSettings.from_dict(obj['sip']) if 'sip' in obj else SipPackageSettings.default(),
            wel=WelPackageSettings.from_dict(obj['wel']) if 'wel' in obj else WelPackageSettings.default(),
        )

    def to_dict(self) -> dict:
        return {
            'bas': self.bas.to_dict(),
            'bcf': self.bcf.to_dict(),
            'chd': self.chd.to_dict(),
            'de4': self.de4.to_dict(),
            'dis': self.dis.to_dict(),
            'drn': self.drn.to_dict(),
            'evt': self.evt.to_dict(),
            'fhb': self.fhb.to_dict(),
            'ghb': self.ghb.to_dict(),
            'gmg': self.gmg.to_dict(),
            'hob': self.hob.to_dict(),
            'lak': self.lak.to_dict(),
            'lpf': self.lpf.to_dict(),
            'mf': self.mf.to_dict(),
            'oc': self.oc.to_dict(),
            'pcg': self.pcg.to_dict(),
            'pcgn': self.pcgn.to_dict(),
            'rch': self.rch.to_dict(),
            'riv': self.riv.to_dict(),
            'available_solver_packages': self.available_solver_packages,
            'selected_solver_package': self.selected_solver_package,
            'available_flow_packages': self.available_flow_packages,
            'selected_flow_package': self.selected_flow_package,
            'sip': self.sip.to_dict(),
            'wel': self.wel.to_dict(),
        }
