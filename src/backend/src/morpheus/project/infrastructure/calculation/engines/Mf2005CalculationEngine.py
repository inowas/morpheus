import dataclasses
import os
import tempfile

import flopy.utils.binaryfile as bf
import numpy as np
from flopy.utils.mflistfile import MfListBudget
from flopy.utils.util_array import Util3d

from morpheus.project.infrastructure.calculation.engines.base.CalculationEngineBase import CalculationEngineBase
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.BasPackageWrapper import create_bas_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.BcfPackageWrapper import create_bcf_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.ChdPackageWrapper import create_chd_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.De4PackageWrapper import create_de4_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DisPackageWrapper import create_dis_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.DrnPackageWrapper import create_drn_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.EvtPackageWrapper import create_evt_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.FhbPackageWrapper import create_fhb_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GhbPackageWrapper import create_ghb_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.GmgPackageWrapper import create_gmg_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.HobPackageMapper import HeadObservationItem, calculate_observation_items
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.HobPackageWrapper import create_hob_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LakPackageWrapper import create_lak_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.LpfPackageWrapper import create_lpf_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.MfPackageWrapper import FlopyModflow, create_mf_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.OcPackageWrapper import create_oc_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgnPackageWrapper import create_pcgn_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.PcgPackageWrapper import create_pcg_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RchPackageWrapper import create_rch_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.RivPackageWrapper import create_riv_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.SipPackageWrapper import create_sip_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.packages.WelPackageWrapper import create_wel_package
from morpheus.project.infrastructure.calculation.engines.modflow_2005.types.Mf2005CalculationEngineSettings import Mf2005CalculationEngineSettings
from morpheus.project.types.calculation.Calculation import CalculationState, Log
from morpheus.project.types.calculation.CalculationProfile import CalculationEngineType, CalculationProfile
from morpheus.project.types.calculation.CalculationResult import AvailableResults, CalculationObservationResultItem, CalculationResult
from morpheus.project.types.Model import Model


@dataclasses.dataclass
class HobOutItem:
    name: str
    simulated: float
    observed: float


class Mf2005CalculationEngine(CalculationEngineBase):
    workspace_path: str
    no_data_value: float

    def __init__(self, workspace_path: str):
        self.workspace_path = workspace_path
        self.no_data_value = -9999.0

    def preprocess(self, model: Model, calculation_profile: CalculationProfile) -> Log:
        if calculation_profile.engine_type != CalculationEngineType.MF2005:
            raise Exception('Calculation profile is not for Mf2005')

        calculation_engine_settings = calculation_profile.engine_settings
        if not isinstance(calculation_engine_settings, Mf2005CalculationEngineSettings):
            raise Exception('Calculation profile is not for Mf2005')

        self.trigger_calculation_state_change(CalculationState.PREPROCESSING)
        flopy_model = self.__prepare_packages(model, calculation_engine_settings)

        check_log = []
        with tempfile.NamedTemporaryFile() as tmp:
            flopy_model.check(verbose=False, level=1, f=tmp.name)
            tmp.seek(0)
            for line in tmp:
                check_log.append(line.decode('utf-8').strip())

        self.trigger_calculation_state_change(CalculationState.PREPROCESSED)
        return Log.from_list(check_log)

    def run(self, model: Model, calculation_profile: CalculationProfile) -> tuple[Log, CalculationResult]:
        if calculation_profile.engine_type != CalculationEngineType.MF2005:
            raise Exception('Calculation profile is not for Mf2005')

        calculation_engine_settings = calculation_profile.engine_settings
        if not isinstance(calculation_engine_settings, Mf2005CalculationEngineSettings):
            raise Exception('Calculation profile is not for Mf2005')

        self.trigger_calculation_state_change(CalculationState.PREPROCESSING)
        flopy_model = self.__prepare_packages(model, calculation_engine_settings)
        flopy_model.write_input()
        self.trigger_calculation_state_change(CalculationState.PREPROCESSED)

        self.trigger_calculation_state_change(CalculationState.CALCULATING)
        return self.__calculate(flopy_model)

    def __prepare_packages(self, model: Model, calculation_engine_settings: Mf2005CalculationEngineSettings) -> FlopyModflow:

        # general packages
        # mf
        flopy_model = create_mf_package(model=model, model_name='mf2005', model_ws=self.workspace_path, settings=calculation_engine_settings.mf)
        # dis
        create_dis_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.dis)
        # bas
        calculation_engine_settings.bas.hnoflo = self.no_data_value
        bas = create_bas_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.bas)

        # boundary condition packages
        # specified head and flux packages

        # chd
        create_chd_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.chd)
        # fhb
        create_fhb_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.fhb)
        # rch
        create_rch_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.rch)
        # wel
        create_wel_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.wel)

        # head-dependent flux packages

        # drn
        create_drn_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.drn)
        # drt
        # Not implemented yet
        # ets
        # Not implemented yet
        # evt
        create_evt_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.evt)
        # ghb
        create_ghb_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.ghb)
        # lak
        lak = create_lak_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.lak)
        # mnw1
        # Not implemented yet
        # mnw2
        # Not implemented yet
        # res
        # Not implemented yet
        # riv
        create_riv_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.riv)
        # sfr
        # Not implemented yet
        # str
        # Not implemented yet
        # uzf
        # Not implemented yet

        # solver packages
        selected_solver_package = calculation_engine_settings.selected_solver_package
        match selected_solver_package:
            case 'de4':
                create_de4_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.de4)
            case 'gmg':
                create_gmg_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.gmg)
            case 'pcg':
                create_pcg_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.pcg)
            case 'pcgn':
                create_pcgn_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.pcgn)
            case 'sip':
                create_sip_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.sip)
            case _:
                raise ValueError(f'Unknown solver package type: {selected_solver_package}')

        # flow packages
        bcf = None
        lpf = None
        selected_flow_package = calculation_engine_settings.selected_flow_package
        match selected_flow_package:
            case 'bcf':
                bcf = create_bcf_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.bcf)
            case 'lpf':
                lpf = create_lpf_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.lpf)
            case 'huf':
                raise NotImplementedError()
            case 'hfb6':
                raise NotImplementedError()
            case 'uzf':
                raise NotImplementedError()
            case 'swi2':
                raise NotImplementedError()
            case _:
                raise ValueError(f'Unknown flow package type: {selected_flow_package}')

        # output control packages
        create_oc_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.oc)

        # observation packages
        create_hob_package(flopy_modflow=flopy_model, model=model, settings=calculation_engine_settings.hob)

        # preprocess lake package
        if lak is not None:
            ibound = bas.ibound.array
            lak_array = lak.lakarr.array[0]
            ibound[lak_array > 0] = 0

            bas.ibound = Util3d(flopy_model, shape=bas.ibound.shape, dtype=bas.ibound.dtype, name=bas.ibound.name, locat=bas.ibound.locat, value=ibound)

            if lpf is not None:
                wetdry = np.array(lpf.wetdry.array)
                wetdry[lak_array > 0] = 0
                lpf.wetdry = Util3d(flopy_model, shape=lpf.wetdry.shape, dtype=lpf.wetdry.dtype, name=lpf.wetdry.name, locat=lpf.wetdry.locat, value=wetdry)

            if bcf is not None and isinstance(bcf.wetdry, Util3d):
                wetdry = np.array(bcf.wetdry.array)
                wetdry[lak_array > 0] = 0
                bcf.wetdry = Util3d(flopy_model, shape=bcf.wetdry.shape, dtype=bcf.wetdry.dtype, name=bcf.wetdry.name, locat=bcf.wetdry.locat, value=wetdry)

        return flopy_model

    def __calculate(self, flopy_model: FlopyModflow) -> tuple[Log, CalculationResult]:
        success, report = flopy_model.run_model(report=True)
        return Log.from_list(report), self.__build_results(success)

    def __build_results(self, success: bool) -> CalculationResult:
        if not success:
            return CalculationResult.failure(message='Calculation failed', files=os.listdir(self.workspace_path), packages=self.get_packages())

        return CalculationResult.success(
            message='Calculation finished successfully',
            files=os.listdir(self.workspace_path),
            flow_head_results=self.__read_flow_head_results(),
            flow_drawdown_results=self.__read_flow_drawdown_results(),
            flow_budget_results=self.__read_flow_budget_results(),
            transport_concentration_results=self.__read_transport_concentration_results(),
            transport_budget_results=self.__read_transport_concentration_budget_results(),
            packages=self.get_packages(),
        )

    def __get_file_with_extension_from_workspace(self, extension: str) -> str | None:
        for file in os.listdir(self.workspace_path):
            if file.endswith(extension):
                return os.path.join(self.workspace_path, file)
        return None

    def __read_min_max_values_from_binary_file(self, head_file: bf.HeadFile) -> tuple[float | None, float | None]:
        try:
            all_data = head_file.get_alldata(nodata=self.no_data_value)  # type: ignore # noqa # nodata is expected to be float, intrisic type is int
            if not isinstance(all_data, np.ndarray):
                all_data = np.array(all_data)
            min_value = float(np.nanmin(all_data))
            min_value = min_value if not np.isnan(min_value) else None
            max_value = float(np.nanmax(all_data))
            max_value = max_value if not np.isnan(max_value) else None
        except ValueError:
            min_value = None
            max_value = None

        return min_value, max_value

    def __read_flow_head_results(self) -> AvailableResults | None:
        file = self.__get_file_with_extension_from_workspace('.hds')
        if file is None:
            return None

        bf_head_file = bf.HeadFile(file)
        min_value, max_value = self.__read_min_max_values_from_binary_file(bf_head_file)

        return AvailableResults(
            times=[float(time) for time in bf_head_file.get_times()],
            kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in bf_head_file.get_kstpkper()],
            number_of_layers=int(bf_head_file.get_data().shape[0]),
            number_of_observations=self.read_number_of_head_observations(),
            min_value=min_value,
            max_value=max_value,
        )

    def __read_flow_drawdown_results(self) -> AvailableResults | None:
        file = self.__get_file_with_extension_from_workspace('.ddn')
        if file is None:
            return None

        bf_head_file = bf.HeadFile(file)
        min_value, max_value = self.__read_min_max_values_from_binary_file(bf_head_file)

        return AvailableResults(
            times=[float(time) for time in bf_head_file.get_times()],
            kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in bf_head_file.get_kstpkper()],
            number_of_layers=int(bf_head_file.get_data().shape[0]),
            number_of_observations=0,
            min_value=min_value,
            max_value=max_value,
        )

    def __read_flow_budget_results(self) -> AvailableResults | None:
        budget_file = self.__get_file_with_extension_from_workspace('.list')
        if budget_file is None:
            return None

        mf_list_budget = MfListBudget(budget_file)
        kstpkper_list = mf_list_budget.get_kstpkper()
        times_list = mf_list_budget.get_times()
        return AvailableResults(
            times=[float(time) for time in times_list] if times_list is not None else [],
            kstpkper=[(int(kstpkper[0]), int(kstpkper[1])) for kstpkper in kstpkper_list] if kstpkper_list is not None else [],
            number_of_layers=0,
            number_of_observations=0,
            min_value=None,
            max_value=None,
        )

    def __read_transport_concentration_results(self) -> AvailableResults | None:
        return None

    def __read_transport_concentration_budget_results(self) -> AvailableResults | None:
        return None

    def __load_flopy_model(self) -> FlopyModflow | None:
        namefile = self.__get_file_with_extension_from_workspace('.nam')
        if namefile is None:
            return None

        return FlopyModflow.load(f=namefile, verbose=False, check=False, exe_name='mf2005', version='mf2005', model_ws=self.workspace_path)

    def read_flow_budget(self, totim: float | None = None, idx: int | None = None, kstpkper: tuple[int, int] | None = None, incremental=False):
        if totim is None and idx is None and kstpkper is None:
            raise Exception('Either totim, idx or kstpkper must be specified')

        file = self.__get_file_with_extension_from_workspace('.list')
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

    def read_transport_concentration(self, totim: float | None = None, idx: int | None = None, kstpkper: tuple[int, int] | None = None, layer=0, precision=4):
        raise NotImplementedError('Transport is not available in Mf2005')

    def read_transport_concentration_time_series(self, layer: int, row: int, col: int, precision=4):
        raise NotImplementedError('Transport is not available in Mf2005')

    def read_transport_budget(self, totim: float | None = None, idx: int | None = None, kstpkper: tuple[int, int] | None = None, incremental=False):
        raise NotImplementedError('Transport is not available in Mf2005')

    def read_flow_drawdown(self, totim: float | None = None, idx: int | None = None, kstpkper: tuple[int, int] | None = None, layer=0, precision=4):
        if totim is None and idx is None and kstpkper is None:
            raise Exception('Either totim, idx or kstpkper must be specified')

        file = self.__get_file_with_extension_from_workspace('.ddn')
        if file is None:
            return []

        data = bf.HeadFile(file).get_data(totim=totim, idx=idx, kstpkper=kstpkper, mflay=layer)
        if data is None:
            return []
        data = np.round(data, precision)
        return data.tolist()

    def read_flow_drawdown_time_series(self, layer: int, row: int, col: int, precision=4):
        file = self.__get_file_with_extension_from_workspace('.ddn')
        if file is None:
            return []

        data = bf.HeadFile(file).get_ts((layer, row, col))
        if data is None:
            return []
        data = np.round(data, precision)
        return data.tolist()

    def read_flow_head(self, totim: float | None = None, idx: int | None = None, kstpkper: tuple[int, int] | None = None, layer=0, precision=4):
        if totim is None and idx is None and kstpkper is None:
            raise Exception('Either totim, idx or kstpkper must be specified')

        file = self.__get_file_with_extension_from_workspace('.hds')
        if file is None:
            return []

        data = bf.HeadFile(file).get_data(totim=totim, idx=idx, kstpkper=kstpkper, mflay=layer)
        if data is None:
            return []
        data = np.round(data, precision)
        return data.tolist()

    def read_flow_head_time_series(self, layer: int, row: int, col: int, precision=4):
        file = self.__get_file_with_extension_from_workspace('.hds')
        if file is None:
            return []

        data = bf.HeadFile(file).get_ts((layer, row, col))
        if data is None:
            return []
        data = np.round(data, precision)
        return data.tolist()

    def read_number_of_head_observations(self) -> int:
        hob_out_file = self.__get_file_with_extension_from_workspace('.hob.out')
        if hob_out_file is None:
            return 0

        with open(hob_out_file) as f:
            header = False
            count = 0
            for line in f:
                if line.startswith('#'):
                    continue

                if not header:
                    header = line.split('"')[1::2]
                    continue

                count += 1

        return count

    def read_head_observations(self, model: Model) -> list[CalculationObservationResultItem]:
        hob_out_file = self.__get_file_with_extension_from_workspace('.hob.out')
        if hob_out_file is None:
            return []

        hob_out_items = {}
        with open(hob_out_file) as f:
            header = False
            for line in f:
                if line.startswith('#'):
                    continue

                if not header:
                    header = line.split('"')[1::2]
                    continue

                values = line.split()
                name = values[2]
                simulated = float(values[0])
                observed = float(values[1])
                hob_out_items[name] = HobOutItem(name=name, simulated=simulated, observed=observed)

        observation_items = calculate_observation_items(model)

        calculation_observation_results = []
        for item in observation_items:
            if not isinstance(item, HeadObservationItem):
                continue

            observation_id = item.observation_id
            observation_name = item.observation_name
            layer = item.layer
            row = item.row
            col = item.column
            for idx, time_series_item in enumerate(item.time_series_data):
                date_time = time_series_item.date_time
                observed = time_series_item.head_value
                simulated = 0.0
                if item.names[idx] in hob_out_items:
                    simulated = hob_out_items[item.names[idx]].simulated
                if idx == 0 and item.obs_name in hob_out_items:
                    simulated = hob_out_items[item.obs_name].simulated

                calculation_observation_results.append(
                    CalculationObservationResultItem(
                        observation_id=observation_id,
                        observation_name=observation_name,
                        layer=layer,
                        row=row,
                        col=col,
                        date_time=date_time.to_str(),
                        simulated=simulated,
                        observed=observed.to_value(),
                    )
                )

        return calculation_observation_results

    def read_file(self, file_name: str) -> str | None:
        file = os.path.join(self.workspace_path, file_name)
        if not os.path.exists(file):
            return None

        try:
            with open(file) as f:
                return f.read()
        except UnicodeError:
            return 'Binary file'

    def get_packages(self) -> list[str]:
        flopy_model = self.__load_flopy_model()
        if flopy_model is None:
            return []
        return flopy_model.get_package_list()

    def get_package(self, package_name: str):
        flopy_model = self.__load_flopy_model()
        if flopy_model is None:
            return None
        return flopy_model.get_package(package_name)
