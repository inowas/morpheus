from typing import Tuple

import flopy.utils.binaryfile as bf
from flopy.utils.util_array import Util3d
import numpy as np
import os
from flopy.utils.mflistfile import MfListBudget
from morpheus.modflow.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.DrnPackageWrapper import \
    create_drn_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.EvtPackageWrapper import \
    create_evt_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.FhbPackageWrapper import \
    create_fhb_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.HobPackageWrapper import \
    create_hob_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.LakPackageWrapper import \
    create_lak_package
from morpheus.modflow.types.calculation.Calculation import CalculationLog
from morpheus.modflow.types.calculation.CalculationProfile import CalculationProfile, CalculationType
from morpheus.modflow.types.calculation.CalculationResult import CalculationResult, AvailableResults, Observation
from morpheus.modflow.types.ModflowModel import ModflowModel
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.types.Mf2005CalculationEngineSettings import \
    Mf2005CalculationEngineSettings
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.GhbPackageWrapper import \
    create_ghb_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.GmgPackageWrapper import \
    create_gmg_package, GmgPackageData
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.PcgnPackageWrapper import \
    create_pcgn_package, PcgnPackageData
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.RchPackageWrapper import \
    create_rch_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.RivPackageWrapper import \
    create_riv_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.SipPackageWrapper import \
    create_sip_package, SipPackageData
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.WelPackageWrapper import \
    create_wel_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.MfPackageWrapper import \
    create_mf_package, \
    FlopyModflow
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.BasPackageWrapper import \
    create_bas_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.ChdPackageWrapper import \
    create_chd_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.DisPackageWrapper import \
    create_dis_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.OcPackageWrapper import create_oc_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.LpfPackageWrapper import \
    create_lpf_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.BcfPackageWrapper import \
    create_bcf_package
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.De4PackageWrapper import \
    create_de4_package, De4PackageData
from morpheus.modflow.infrastructure.calculation.engines.modflow_2005.packages.PcgPackageWrapper import \
    create_pcg_package, PcgPackageData


class Mf2005CalculationEngine(CalculationEngineBase):
    workspace_path: str

    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path

    def run(self, modflow_model: ModflowModel, calculation_profile: CalculationProfile) -> Tuple[
        CalculationLog, CalculationResult
    ]:
        if calculation_profile.calculation_engine_type != CalculationType.MF2005:
            raise Exception('Calculation profile is not for Mf2005')

        calculation_engine_settings = calculation_profile.calculation_engine_settings
        if not isinstance(calculation_engine_settings, Mf2005CalculationEngineSettings):
            raise Exception('Calculation profile is not for Mf2005')

        self.trigger_start_preprocessing()
        flopy_model = self.__prepare_packages(modflow_model, calculation_engine_settings)
        flopy_model.write_input()

        self.trigger_start_running()
        return self.__calculate(flopy_model)

    def __prepare_packages(self, modflow_model: ModflowModel,
                           calculation_profile: Mf2005CalculationEngineSettings) -> FlopyModflow:

        # general packages

        # mf
        flopy_model = create_mf_package(modflow_model, model_ws=self.workspace_path)
        # dis
        create_dis_package(flopy_model, modflow_model)
        # bas
        bas = create_bas_package(flopy_model, modflow_model)

        # boundary condition packages

        # specified head and flux packages

        # chd
        create_chd_package(flopy_model, modflow_model)
        # fhb
        create_fhb_package(flopy_model, modflow_model)
        # rch
        create_rch_package(flopy_model, modflow_model)
        # wel
        create_wel_package(flopy_model, modflow_model)

        # head-dependent flux packages

        # drn
        create_drn_package(flopy_model, modflow_model)
        # drt
        # Not implemented yet
        # ets
        # Not implemented yet
        # evt
        create_evt_package(flopy_model, modflow_model)
        # ghb
        create_ghb_package(flopy_model, modflow_model)
        # lak
        lak = create_lak_package(flopy_model, modflow_model)
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
        solver_package = calculation_profile.get_solver_package_data()
        solver_package_type = solver_package.type
        solver_package_data = solver_package.data

        match solver_package_type:
            case 'de4':
                if not isinstance(solver_package_data, De4PackageData):
                    raise ValueError(f'Expected {De4PackageData.__name__} but got {type(solver_package_data)}')
                create_de4_package(flopy_model, solver_package_data)
            case 'gmg':
                if not isinstance(solver_package_data, GmgPackageData):
                    raise ValueError(f'Expected {GmgPackageData.__name__} but got {type(solver_package_data)}')
                create_gmg_package(flopy_model, solver_package_data)
            case 'pcg':
                if not isinstance(solver_package_data, PcgPackageData):
                    raise ValueError(f'Expected {PcgPackageData.__name__} but got {type(solver_package_data)}')
                create_pcg_package(flopy_model, solver_package_data)
            case 'pcgn':
                if not isinstance(solver_package_data, PcgnPackageData):
                    raise ValueError(f'Expected {PcgnPackageData.__name__} but got {type(solver_package_data)}')
                create_pcgn_package(flopy_model, solver_package_data)
            case 'sip':
                if not isinstance(solver_package_data, SipPackageData):
                    raise ValueError(f'Expected {SipPackageData.__name__} but got {type(solver_package_data)}')
                create_sip_package(flopy_model, solver_package_data)
            case _:
                raise ValueError(f'Unknown solver package type: {solver_package_type}')

        # flow packages
        flow_package_data = calculation_profile.get_flow_package_data()
        bcf = None
        lpf = None
        match flow_package_data.type:
            case 'bcf':
                bcf = create_bcf_package(flopy_model, modflow_model)
            case 'lpf':
                lpf = create_lpf_package(flopy_model, modflow_model)
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
        create_oc_package(flopy_model, calculation_profile.get_oc_package_data())

        # observation packages
        create_hob_package(flopy_model, modflow_model)

        # preprocess lake package
        if lak is not None:
            ibound = bas.ibound.array
            lak_array = lak.lakarr.array[0]
            ibound[lak_array > 0] = 0

            bas.ibound = Util3d(
                flopy_model,
                shape=bas.ibound.shape,
                dtype=bas.ibound.dtype,
                name=bas.ibound.name,
                locat=bas.ibound.locat,
                value=ibound)

            if lpf is not None:
                wetdry = np.array(lpf.wetdry.array)
                wetdry[lak_array > 0] = 0
                lpf.wetdry = Util3d(
                    flopy_model,
                    shape=lpf.wetdry.shape,
                    dtype=lpf.wetdry.dtype,
                    name=lpf.wetdry.name,
                    locat=lpf.wetdry.locat,
                    value=wetdry)

            if bcf is not None:
                if isinstance(bcf.wetdry, Util3d):
                    wetdry = np.array(bcf.wetdry.array)
                    wetdry[lak_array > 0] = 0
                    bcf.wetdry = Util3d(
                        flopy_model,
                        shape=bcf.wetdry.shape,
                        dtype=bcf.wetdry.dtype,
                        name=bcf.wetdry.name,
                        locat=bcf.wetdry.locat,
                        value=wetdry)

        return flopy_model

    def __calculate(self, flopy_model: FlopyModflow) -> Tuple[CalculationLog, CalculationResult]:
        success, report = flopy_model.run_model(report=True)
        return CalculationLog.from_list(report), self.__build_results(success)

    def __build_results(self, success: bool) -> CalculationResult:
        if not success:
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
        file = self.__get_file_with_extension_from_workspace(".hds")
        if file is None:
            return None

        bf_head_file = bf.HeadFile(file)
        return AvailableResults(
            times=[float(time) for time in bf_head_file.get_times()],
            kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in bf_head_file.get_kstpkper()],
            number_of_layers=int(bf_head_file.get_data().shape[0]),
            number_of_observations=len(self.read_head_observations()),
        )

    def __read_drawdown_results(self) -> AvailableResults | None:
        file = self.__get_file_with_extension_from_workspace(".ddn")
        if file is None:
            return None

        bf_head_file = bf.HeadFile(file)
        return AvailableResults(
            times=[float(time) for time in bf_head_file.get_times()],
            kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in bf_head_file.get_kstpkper()],
            number_of_layers=int(bf_head_file.get_data().shape[0]),
            number_of_observations=0,
        )

    def __read_budget_results(self) -> AvailableResults | None:
        budget_file = self.__get_file_with_extension_from_workspace(".list")
        if budget_file is None:
            return None

        mf_list_budget = MfListBudget(budget_file)
        kstpkper_list = mf_list_budget.get_kstpkper()
        times_list = mf_list_budget.get_times()
        return AvailableResults(
            times=[float(time) for time in times_list] if times_list is not None else [],
            kstpkper=
            [(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in kstpkper_list]
            if kstpkper_list is not None
            else [],
            number_of_layers=0,
            number_of_observations=0,
        )

    def __read_concentration_results(self) -> AvailableResults | None:
        return None

    def read_budget(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        incremental=False
    ):
        if totim is None and idx is None and kstpkper is None:
            raise Exception('Either totim, idx or kstpkper must be specified')

        file = self.__get_file_with_extension_from_workspace(".list")
        if file is None:
            return []

        budget = MfListBudget(file).get_data(totim=totim, idx=idx, kstpkper=kstpkper, incremental=incremental)
        if budget is None:
            return []

        values = {}
        for x in budget:
            param = str(x[2].decode('UTF-8'))
            values[param] = float(str(x[1]))
        return values

    def read_concentration(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0
    ):
        return []

    def read_drawdown(
        self, totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0
    ):
        if totim is None and idx is None and kstpkper is None:
            raise Exception('Either totim, idx or kstpkper must be specified')

        file = self.__get_file_with_extension_from_workspace(".ddn")
        if file is None:
            return []

        data = bf.HeadFile(file).get_data(totim=totim, idx=idx, kstpkper=kstpkper, mflay=layer)
        if data is None:
            return []
        data = np.round(data, 3)
        data[data < -999] = None
        return data.tolist()

    def read_head(
        self,
        totim: float | None = None,
        idx: int | None = None,
        kstpkper: Tuple[int, int] | None = None,
        layer=0
    ):
        if totim is None and idx is None and kstpkper is None:
            raise Exception('Either totim, idx or kstpkper must be specified')

        file = self.__get_file_with_extension_from_workspace(".hds")
        if file is None:
            return []

        data = bf.HeadFile(file).get_data(totim=totim, idx=idx, kstpkper=kstpkper, mflay=layer)
        if data is None:
            return []
        data = np.round(data, 3)
        data[data <= -999] = None
        return data.tolist()

    def read_head_observations(self) -> list[Observation]:
        hob_out_file = self.__get_file_with_extension_from_workspace(".hob.out")
        if hob_out_file is None:
            return []

        observations = []
        f = open(hob_out_file)
        header = False
        for line in f:
            if line.startswith('#'):
                continue

            if not header:
                header = line.split('"')[1::2]
                continue

            values = line.split()
            observations.append(Observation(
                simulated=float(values[0]),
                observed=float(values[1]),
                name=values[2],
            ))

        return observations
