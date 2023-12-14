import flopy.utils.binaryfile as bf
import numpy as np
import os
from flopy.utils.mflistfile import MfListBudget
from morpheus.modflow.infrastructure.calculation.CalculationEngineBase import CalculationEngineBase
from morpheus.modflow.types.calculation.Calculation import CalculationLog
from morpheus.modflow.types.calculation.CalculationEngineRunReport import CalculationEngineRunReport
from morpheus.modflow.types.calculation.CalculationProfile import CalculationProfile, CalculationEngineType
from morpheus.modflow.types.calculation.CalculationResult import CalculationResult, AvailableResults
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.infrastructure.calculation.modflow_2005.Mf2005CalculationEngineSettings import \
    Mf2005CalculationEngineSettings
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.GhbPackageWrapper import create_ghb_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.GmgPackageWrapper import create_gmg_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.PcgnPackageWrapper import create_pcgn_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.RchPackageWrapper import create_rch_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.RivPackageWrapper import create_riv_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.SipPackageWrapper import create_sip_package
from morpheus.modflow.infrastructure.calculation.modflow_2005.packages.WelPackageWrapper import create_wel_package
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


class Mf2005CalculationEngine(CalculationEngineBase):
    workspace_path: str
    flopy_model: FlopyModflow = None

    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path

    def run(self, modflow_model: ModflowModel, calculation_profile: CalculationProfile) -> CalculationEngineRunReport:
        if calculation_profile.calculation_engine_type != CalculationEngineType.MF2005:
            raise Exception('Calculation profile is not for Mf2005')

        self.trigger_start_preprocessing()
        flopy_model = self.__prepare_packages(modflow_model, Mf2005CalculationEngineSettings.from_dict(calculation_profile.calculation_engine_settings))
        flopy_model.write_input()

        self.trigger_start_running()
        return self.__calculate(flopy_model)

    def __prepare_packages(self, modflow_model: ModflowModel, calculation_profile: Mf2005CalculationEngineSettings) -> FlopyModflow:

        # general packages

        # mf
        flopy_model = create_mf_package(modflow_model, model_ws=self.workspace_path)
        # dis
        create_dis_package(flopy_model, modflow_model)
        # bas
        create_bas_package(flopy_model, modflow_model)

        # boundary condition packages

        # specified head and flux packages

        # chd
        create_chd_package(flopy_model, modflow_model)
        # fhb
        # Not implemented yet
        # rch
        create_rch_package(flopy_model, modflow_model)
        # wel
        create_wel_package(flopy_model, modflow_model)

        # head-dependent flux packages

        # drn
        # Not implemented yet
        # drt
        # Not implemented yet
        # ets
        # Not implemented yet
        # evt
        # Not implemented yet
        # ghb
        create_ghb_package(flopy_model, modflow_model)
        # lak
        # Not implemented yet
        # mnw1
        # Not implemented yet
        # mnw2
        # Not implemented yet
        # res
        # Not implemented yet
        # riv
        create_riv_package(flopy_model, modflow_model)
        # sfr
        # Not implemented yet
        # str
        # Not implemented yet
        # uzf
        # Not implemented yet


        # solvers are defined in the calculation profile
        solver_package_data = calculation_profile.get_solver_package_data()
        match solver_package_data.type:
            case 'de4':
                create_de4_package(flopy_model, solver_package_data.data)
            case 'gmg':
                create_gmg_package(flopy_model, solver_package_data.data)
            case 'pcg':
                create_pcg_package(flopy_model, solver_package_data.data)
            case 'pcgn':
                create_pcgn_package(flopy_model, solver_package_data.data)
            case 'sip':
                create_sip_package(flopy_model, solver_package_data.data)
            case _:
                raise ValueError(f'Unknown solver package type: {solver_package_data.type}')

        # flow packages
        flow_package_data = calculation_profile.get_flow_package_data()
        match flow_package_data.type:
            case 'bcf':
                create_bcf_package(flopy_model, modflow_model)
            case 'lpf':
                create_lpf_package(flopy_model, modflow_model)
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
        create_oc_package(
            flopy_model,
            calculation_profile.get_oc_package_data()
        )

        return flopy_model

    def __calculate(self, flopy_model: FlopyModflow) -> CalculationEngineRunReport:
        success, report = flopy_model.run_model(report=True)
        return CalculationEngineRunReport(
            calculation_log=CalculationLog.try_from_list(report),
            calculation_result=self.__build_results(success)
        )

    def __build_results(self, success: bool) -> CalculationResult:
        if (not success):
            return CalculationResult.failure(
                message="Calculation failed",
                files=os.listdir(self.workspace_path)
            )

        return CalculationResult.success(
            message="Calculation finished successfully",
            files=os.listdir(self.workspace_path),
            head_results=self.__read_head_results(),
            drawdown_results=self.__read_drawdown_results(),
            budget_results=self.__read_budget_results(),
            concentration_results=self.__read_concentration_results(),
        )

    def __get_file_with_extension_from_workspace(self, extension: str) -> str | None:
        for file in os.listdir(self.workspace_path):
            if file.endswith(extension):
                return os.path.join(self.workspace_path, file)
        return None

    def __read_head_results(self) -> AvailableResults | None:
        try:
            head_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".hds"))
            return AvailableResults(
                times=[float(time) for time in head_file.get_times()],
                kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in head_file.get_kstpkper()],
                number_of_layers=int(head_file.get_data().shape[0]),
            )
        except:
            return None

    def read_heads_by_totim(self, totim=0, layer=0):
        try:
            head_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".hds"))
            data = head_file.get_data(totim=totim, mflay=layer)
            data = np.round(data, 3)
            data[data <= -999] = None
            return data.tolist()
        except:
            return []

    def read_heads_by_idx(self, idx=0, layer=0):
        try:
            head_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".hds"))
            data = head_file.get_data(idx=idx, mflay=layer)
            data = np.round(data, 3)
            data[data <= -999] = None
            return data.tolist()
        except:
            return []

    def read_heads_by_kstpkper(self, kstpkper=(0, 0), layer=0):
        try:
            head_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".hds"))
            data = head_file.get_data(kstpkper=kstpkper, mflay=layer)
            data = np.round(data, 3)
            data[data <= -999] = None
            return data.tolist()
        except:
            return []

    def __read_drawdown_results(self) -> AvailableResults | None:
        try:
            drawdown_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".ddn"))
            return AvailableResults(
                times=[float(time) for time in drawdown_file.get_times()],
                kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in drawdown_file.get_kstpkper()],
                number_of_layers=int(drawdown_file.get_data().shape[0]),
            )
        except:
            return None

    def read_drawdown_by_totim(self, totim=0, layer=0):
        try:
            drawdown_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".ddn"))
            data = drawdown_file.get_data(totim=totim, mflay=layer)
            data = np.round(data, 3)
            data[data < -999] = None
            return data.tolist()
        except:
            return []

    def read_drawdown_by_idx(self, idx=0, layer=0):
        try:
            drawdown_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".ddn"))
            data = drawdown_file.get_data(idx=idx, mflay=layer)
            data = np.round(data, 3)
            data[data < -999] = None
            return data.tolist()
        except:
            return []

    def read_drawdown_by_kstpkper(self, kstpkper=(0, 0), layer=0):
        try:
            drawdown_file = bf.HeadFile(self.__get_file_with_extension_from_workspace(".ddn"))
            data = drawdown_file.get_data(kstpkper=kstpkper, mflay=layer)
            data = np.round(data, 3)
            data[data < -999] = None
            return data.tolist()
        except:
            return []

    def __read_budget_results(self) -> AvailableResults | None:
        try:
            budget_file = MfListBudget(self.__get_file_with_extension_from_workspace(".list"))
            return AvailableResults(
                times=[float(time) for time in budget_file.get_times()],
                kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in budget_file.get_kstpkper()],
                number_of_layers=0,
            )
        except:
            return None

    def read_budget_by_totim(self, totim=0, incremental=False):
        try:
            budget_file = MfListBudget(self.__get_file_with_extension_from_workspace(".list"))
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
            budget_file = MfListBudget(self.__get_file_with_extension_from_workspace(".list"))
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
            budget_file = MfListBudget(self.__get_file_with_extension_from_workspace(".list"))
            budget = budget_file.get_data(kstpkper=kstpkper, incremental=incremental)
            values = {}
            for x in budget:
                param = str(x[2].decode('UTF-8'))
                values[param] = float(str(x[1]))
            return values
        except:
            return []

    def __read_concentration_results(self) -> AvailableResults | None:
        return None
