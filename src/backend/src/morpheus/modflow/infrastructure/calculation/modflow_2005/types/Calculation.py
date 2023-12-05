import dataclasses
import tempfile

from morpheus.common.types import Uuid
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.GmgPackageWrapper import create_gmg_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.PcgnPackageWrapper import create_pcgn_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.SipPackageWrapper import create_sip_package
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.infrastructure.calculation.modflow_2005.types.CalculationProfile import Mf2005CalculationProfile
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.MfPackageWrapper import create_mf_package, \
    FlopyModflow
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.BasPackageWrapper import create_bas_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.ChdPackageWrapper import create_chd_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.DisPackageWrapper import create_dis_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.OcPackageWrapper import create_oc_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.LpfPackageWrapper import create_lpf_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.BcfPackageWrapper import create_bcf_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.De4PackageWrapper import create_de4_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.PcgPackageWrapper import create_pcg_package


class CalculationId(Uuid):
    pass


@dataclasses.dataclass
class Modflow2005Calculation:
    calculation_id: CalculationId
    modflow_model: ModflowModel
    calculation_profile: Mf2005CalculationProfile
    calculation_type = 'mf2005'

    # data calculated during preprocessing
    flopy_model: FlopyModflow = None

    general_packages = {
        'mf': None,
        'bas': None,
        'dis': None,
    }
    boundary_packages = {
        'chd': None,
        'fhb': None,
        'rch': None,
        'wel': None,
        'drn': None,
        'drt': None,
        'ets': None,
        'evt': None,
        'ghb': None,
        'lak': None,
        'mnw1': None,
        'mnw2': None,
        'res': None,
        'riv': None,
        'sfr': None,
        'str': None,
        'uzf': None,
    }
    solver_package = None
    flow_package = None
    output_control_package = None

    def __init__(self, calculation_id: CalculationId, modflow_model: ModflowModel,
                 calculation_profile: Mf2005CalculationProfile):
        self.calculation_id = calculation_id
        self.modflow_model = modflow_model
        self.calculation_profile = calculation_profile

    @classmethod
    def new(cls, modflow_model: ModflowModel, calculation_profile: Mf2005CalculationProfile):
        calculation_id = CalculationId.new()
        return cls(calculation_id, modflow_model, calculation_profile)

    def preprocess(self, model_ws: str, exe_name: str):
        self.flopy_model = create_mf_package(self.modflow_model, model_ws, exe_name)

        # general packages
        self.general_packages = {
            'mf': self.flopy_model,
            'dis': create_dis_package(self.flopy_model, self.modflow_model),
            'bas': create_bas_package(self.flopy_model, self.modflow_model),
        }

        # boundary condition packages
        # specified head and flux packages
        self.boundary_packages = {
            'chd': create_chd_package(self.flopy_model, self.modflow_model),
            'fhb': None,
            'rch': None,
            'wel': None,
        }

        # head-dependent flux packages
        self.boundary_packages = {
            'drn': None,
            'drt': None,
            'ets': None,
            'evt': None,
            'ghb': None,
            'lak': None,
            'mnw1': None,
            'mnw2': None,
            'res': None,
            'riv': None,
            'sfr': None,
            'str': None,
            'uzf': None,
        }

        # solvers are defined in the calculation profile
        solver_package_data = self.calculation_profile.get_solver_package_data()
        match solver_package_data.type:
            case 'de4':
                self.solver_package = create_de4_package(self.flopy_model, solver_package_data.data)
            case 'gmg':
                self.solver_package = create_gmg_package(self.flopy_model, solver_package_data.data)
            case 'pcg':
                self.solver_package = create_pcg_package(self.flopy_model, solver_package_data.data)
            case 'pcgn':
                self.solver_package = create_pcgn_package(self.flopy_model, solver_package_data.data)
            case 'sip':
                self.solver_package = create_sip_package(self.flopy_model, solver_package_data.data)
            case _:
                raise ValueError(f'Unknown solver package type: {solver_package_data.type}')

        # flow packages
        flow_package_data = self.calculation_profile.get_flow_package_data()
        match flow_package_data.type:
            case 'bcf':
                self.flow_package = create_bcf_package(self.flopy_model, self.modflow_model)
            case 'lpf':
                self.flow_package = create_lpf_package(self.flopy_model, self.modflow_model)
            case 'huf':
                raise NotImplementedError()
            case 'hfb6':
                raise NotImplementedError()
            case 'uzf':
                raise NotImplementedError()
            case 'swi2':
                raise NotImplementedError()
            case _:
                raise ValueError(f'Unknown flow package type: {flow_package_data.type}')

        # output control packages
        self.output_control_package = create_oc_package(
            self.flopy_model,
            self.calculation_profile.get_oc_package_data()
        )

    def is_preprocessed(self) -> bool:
        return self.flopy_model is not None

    def check(self) -> str:
        if not self.is_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        with tempfile.NamedTemporaryFile() as check_file:
            file_name = check_file.name
            self.flopy_model.check(f=file_name)
            with open(file_name, 'r') as f:
                content = f.read()
            check_file.close()
        return content

    def write_input(self):
        if not self.is_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        self.flopy_model.write_input()

    def run(self):
        if not self.is_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        self.flopy_model.run_model()

    def to_dict(self) -> dict:
        return {
            'calculation_id': self.calculation_id.to_value(),
            'modflow_model': self.modflow_model.to_dict(),
            'calculation_type': self.calculation_type,
            'calculation_profile': self.calculation_profile.to_dict(),
        }

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            calculation_id=CalculationId.from_value(obj['calculation_id']),
            modflow_model=ModflowModel.from_dict(obj['modflow_model']),
            calculation_profile=Mf2005CalculationProfile.from_dict(obj['calculation_profile']),
        )
