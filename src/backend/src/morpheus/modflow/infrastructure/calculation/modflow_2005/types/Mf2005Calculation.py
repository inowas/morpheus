import dataclasses
import os
import tempfile

import flopy.utils.binaryfile as bf
import numpy as np
from flopy.utils.mflistfile import MfListBudget

from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.GmgPackageWrapper import create_gmg_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.PcgnPackageWrapper import create_pcgn_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.SipPackageWrapper import create_sip_package
from morpheus.modflow.infrastructure.calculation.types.CalculationBase import CalculationId, CalculationBase, \
    CalculationResult, CalculationState, CalculationType, CalculationLog, AvailableResults
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.infrastructure.calculation.modflow_2005.types.Mf2005CalculationProfile import \
    Mf2005CalculationProfile
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


@dataclasses.dataclass
class Mf2005Calculation(CalculationBase):
    calculation_id: CalculationId
    modflow_model: ModflowModel
    calculation_profile: Mf2005CalculationProfile
    calculation_type = CalculationType.mf2005()
    workspace_path: str | None
    base_path: str | None

    calculation_state: CalculationState
    calculation_log: CalculationLog | None
    calculation_result: CalculationResult | None

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
                 calculation_profile: Mf2005CalculationProfile,
                 calculation_state: CalculationState = CalculationState.created(),
                 calculation_log: CalculationLog | None = None,
                 calculation_results: CalculationResult | None = None,
                 workspace_path=None, base_path=None):

        self.calculation_id = calculation_id
        self.modflow_model = modflow_model
        self.calculation_profile = calculation_profile
        self.calculation_state = calculation_state
        self.calculation_log = calculation_log
        self.calculation_result = calculation_results
        self.workspace_path = workspace_path
        self.base_path = base_path

    @classmethod
    def new(cls, modflow_model: ModflowModel, calculation_profile: Mf2005CalculationProfile):
        return cls(calculation_id=CalculationId.new(), modflow_model=modflow_model,
                   calculation_profile=calculation_profile)

    @classmethod
    def from_dict(cls, obj):
        calculation_log = None
        if 'calculation_log' in obj and obj['calculation_log'] is not None:
            calculation_log = CalculationLog.from_list(obj['calculation_log'])

        calculation_results = None
        if 'calculation_results' in obj and obj['calculation_results'] is not None:
            calculation_results = CalculationResult.from_dict(obj['calculation_results'])

        return cls(
            calculation_id=CalculationId.from_str(obj['calculation_id']),
            modflow_model=ModflowModel.from_dict(obj['modflow_model']),
            calculation_profile=Mf2005CalculationProfile.from_dict(obj['calculation_profile']),
            calculation_state=CalculationState.from_value(obj['calculation_state']),
            calculation_log=calculation_log,
            calculation_results=calculation_results,
            workspace_path=obj['workspace_path'],
        )

    def to_dict(self) -> dict:
        return {
            'calculation_id': self.calculation_id.to_str(),
            'modflow_model': self.modflow_model.to_dict(),
            'calculation_profile': self.calculation_profile.to_dict(),
            'calculation_type': self.calculation_type.to_str(),
            'calculation_state': self.calculation_state.to_str(),
            'calculation_log': self.calculation_log.to_list() if self.calculation_log is not None else None,
            'calculation_results': self.calculation_result.to_dict() if self.calculation_result is not None else None,
            'workspace_path': self.workspace_path,
        }

    def preprocess(self, base_path: str):
        self.base_path = os.path.abspath(base_path)
        self.workspace_path = self.calculation_id.to_str()
        self.flopy_model = create_mf_package(self.modflow_model, model_ws=self.get_absolute_path_to_workspace())

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

    def has_been_preprocessed(self) -> bool:
        return self.flopy_model is not None

    def write_input(self):
        if not self.has_been_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        self.flopy_model.write_input()

    def input_has_been_written(self) -> bool:
        model_ws = self.flopy_model.model_ws
        return os.path.exists(os.path.join(model_ws, self.flopy_model.namefile))

    def check(self) -> str:
        if not self.has_been_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        with tempfile.NamedTemporaryFile() as check_file:
            file_name = check_file.name
            self.flopy_model.check(f=file_name)
            with open(file_name, 'r') as f:
                content = f.read()
            check_file.close()
        return content

    def run(self) -> None:
        if not self.has_been_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        if not self.input_has_been_written():
            raise ValueError('Calculation input has not been written yet')

        try:
            success, report = self.flopy_model.run_model(report=True)
            self.calculation_log = CalculationLog.from_list(report)
            self.calculation_state = CalculationState.success() if success else CalculationState.failed()
        except Exception as e:
            self.calculation_log = CalculationLog.from_list([str(e)])
            self.calculation_state = CalculationState.failed()

    def postprocess(self):
        if not self.has_been_preprocessed():
            raise ValueError('Calculation is not preprocessed yet')

        if not self.input_has_been_written():
            raise ValueError('Calculation input has not been written yet')

        if not self.calculation_state.success() or not self.calculation_state.failed():
            raise ValueError('Calculation has not been calculated')

        if self.calculation_state.success():
            self.calculation_result = CalculationResult(
                state=self.calculation_state,
                files=os.listdir(self.flopy_model.model_ws),
                message="Calculation has been finished successfully",
                head_results=self.read_head_results(),
                drawdown_results=self.read_drawdown_results(),
                budget_results=self.read_budget_results(),
                concentration_results=self.read_concentration_results(),
            )
            return

        self.calculation_result = CalculationResult(
            state=self.calculation_state,
            files=os.listdir(self.flopy_model.model_ws),
            message="Calculation has failed",
            head_results=None,
            drawdown_results=None,
            budget_results=None,
            concentration_results=None,
        )

    def process(self, data_base_path: str):
        self.calculation_state = CalculationState.preprocessing()
        self.preprocess(data_base_path)
        self.write_input()
        self.calculation_state = CalculationState.running()
        self.run()
        self.postprocess()

    def get_absolute_path_to_workspace(self) -> str:
        return os.path.join(self.base_path, self.workspace_path)

    def get_file_with_extension(self, extension: str) -> str | None:
        absolute_path = self.get_absolute_path_to_workspace()
        for file in os.listdir(absolute_path):
            if file.endswith(extension):
                return os.path.join(self.get_absolute_path_to_workspace(), file)
        return None

    def read_head_results(self) -> AvailableResults | None:
        try:
            head_file = bf.HeadFile(self.get_file_with_extension(".hds"))
            return AvailableResults(
                times=[float(time) for time in head_file.get_times()],
                kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in head_file.get_kstpkper()],
                number_of_layers=int(head_file.get_data().shape[0]),
            )
        except:
            return None

    def read_heads_by_totim(self, totim=0, layer=0):
        try:
            head_file = bf.HeadFile(self.get_file_with_extension(".hds"))
            data = head_file.get_data(totim=totim, mflay=layer)
            data = np.round(data, 3)
            data[data <= -999] = None
            return data.tolist()
        except:
            return []

    def read_heads_by_idx(self, idx=0, layer=0):
        try:
            head_file = bf.HeadFile(self.get_file_with_extension(".hds"))
            data = head_file.get_data(idx=idx, mflay=layer)
            data = np.round(data, 3)
            data[data <= -999] = None
            return data.tolist()
        except:
            return []

    def read_heads_by_kstpkper(self, kstpkper=(0, 0), layer=0):
        try:
            head_file = bf.HeadFile(self.get_file_with_extension(".hds"))
            data = head_file.get_data(kstpkper=kstpkper, mflay=layer)
            data = np.round(data, 3)
            data[data <= -999] = None
            return data.tolist()
        except:
            return []

    def read_drawdown_results(self) -> AvailableResults | None:
        try:
            drawdown_file = bf.HeadFile(self.get_file_with_extension(".ddn"))
            return AvailableResults(
                times=[float(time) for time in drawdown_file.get_times()],
                kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in drawdown_file.get_kstpkper()],
                number_of_layers=int(drawdown_file.get_data().shape[0]),
            )
        except:
            return None

    def read_drawdown_by_totim(self, totim=0, layer=0):
        try:
            drawdown_file = bf.HeadFile(self.get_file_with_extension(".ddn"))
            data = drawdown_file.get_data(totim=totim, mflay=layer)
            data = np.round(data, 3)
            data[data < -999] = None
            return data.tolist()
        except:
            return []

    def read_drawdown_by_idx(self, idx=0, layer=0):
        try:
            drawdown_file = bf.HeadFile(self.get_file_with_extension(".ddn"))
            data = drawdown_file.get_data(idx=idx, mflay=layer)
            data = np.round(data, 3)
            data[data < -999] = None
            return data.tolist()
        except:
            return []

    def read_drawdown_by_kstpkper(self, kstpkper=(0, 0), layer=0):
        try:
            drawdown_file = bf.HeadFile(self.get_file_with_extension(".ddn"))
            data = drawdown_file.get_data(kstpkper=kstpkper, mflay=layer)
            data = np.round(data, 3)
            data[data < -999] = None
            return data.tolist()
        except:
            return []

    def read_budget_results(self) -> AvailableResults | None:
        try:
            budget_file = MfListBudget(self.get_file_with_extension(".list"))
            return AvailableResults(
                times=[float(time) for time in budget_file.get_times()],
                kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in budget_file.get_kstpkper()],
                number_of_layers=0,
            )
        except:
            return None

    def read_budget_by_totim(self, totim=0, incremental=False):
        try:
            budget_file = MfListBudget(self.get_file_with_extension(".list"))
            budget = budget_file.get_data(totim=totim, incremental=incremental)
            values = {}
            for x in budget:
                param = str(x[2].decode('UTF-8'))
                values[param] = float(str(x[1]))
            return values
        except:
            return []

    def read_budget_by_idx(self, idx=0, incremental=False):
        try:
            budget_file = MfListBudget(self.get_file_with_extension(".list"))
            budget = budget_file.get_data(idx=idx, incremental=incremental)
            values = {}
            for x in budget:
                param = str(x[2].decode('UTF-8'))
                values[param] = float(str(x[1]))
            return values
        except:
            return []

    def read_budget_by_kstpkper(self, kstpkper=(0, 0), incremental=False):
        try:
            budget_file = MfListBudget(self.get_file_with_extension(".list"))
            budget = budget_file.get_data(kstpkper=kstpkper, incremental=incremental)
            values = {}
            for x in budget:
                param = str(x[2].decode('UTF-8'))
                values[param] = float(str(x[1]))
            return values
        except:
            return []

    def read_concentration_results(self) -> AvailableResults | None:
        return None
