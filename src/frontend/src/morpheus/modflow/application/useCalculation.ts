import {useRef, useState} from 'react';
import {ICalculationProfile} from '../types/CalculationProfile.type';
import {IError} from '../../types';
import {ICalculation, ICalculationId, ICalculationResultType, ICalculationState} from '../types/Calculation.type';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {useApi} from '../incoming';
import useProjectCommandBus from './useProjectCommandBus';
import {IStartCalculationCommand} from './useProjectCommandBus.type';


interface IUseCalculation {
  fetchCalculationById: (calculationId: string) => Promise<ICalculation | undefined>;
  fetchLatestCalculation: () => Promise<ICalculation | undefined>;
  fetchFile: (calculationId: string, file: string) => Promise<string | undefined>;
  startCalculation: () => Promise<ICalculationId | undefined>;
  loading: boolean;
  error?: IError;
}

interface ICalculationResponse {
  project_id: string;
  calculation_id: string;
  model_id: string;
  model_hash: string;
  model_version: string;
  profile_id: string;
  profile_hash: string;
  lifecycle: ICalculationState[];
  state: ICalculationState;
  check_model_log: string[] | null;
  calculation_log: string[] | null;
  result: {
    type: ICalculationResultType
    message: string;
    files: string[];
    flow_head_results: {
      times: number[];
      kstpkper: [number, number][];
      number_of_layers: number;
      number_of_observations: number;
    };
    flow_drawdown_results: {
      times: number[];
      kstpkper: [number, number][];
      number_of_layers: number;
      number_of_observations: number;
    };
    flow_budget_results: {
      times: number[];
      kstpkper: [number, number][];
      number_of_layers: number;
      number_of_observations: number;
    };
    transport_concentration_results: {
      times: number[];
      kstpkper: [number, number][];
      number_of_layers: number;
      number_of_observations: number;
    };
    transport_budget_results: {
      times: number[];
      kstpkper: [number, number][];
      number_of_layers: number;
      number_of_observations: number;
    };
    packages: string[];
  } | null;
}

interface IFetchFileResponse {
  file_name: string;
  file_content: string;
}

const useCalculation = (projectId: string): IUseCalculation => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const startCalculation = async (): Promise<string | undefined> => {

    if (!model) {
      return;
    }

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);


    const command: IStartCalculationCommand = {
      command_name: 'start_calculation_command', payload: {
        project_id: projectId,
        model_id: model.model_id,
      },
    };

    const result = await sendCommand(command);
    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      return result.val?.split('/').pop();
    }

    if (result.err) {
      setError(result.val);
    }
  };

  const fetchCalculationById = async (calculationId: string): Promise<ICalculation | undefined> => {
    setLoading(true);
    setError(null);

    const response = await httpGet<ICalculationResponse>(`/projects/${projectId}/calculations/${calculationId}`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      return response.val;
    }

    if (response.err) {
      setError(response.val);
    }
  };

  const fetchLatestCalculation = async (): Promise<ICalculation | undefined> => {
    setLoading(true);
    setError(null);

    const response = await httpGet<ICalculationResponse>(`/projects/${projectId}/model/calculation`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      return response.val;
    }

    if (response.err) {
      setError(response.val);
    }
  };

  const fetchFile = async (calculationId: string, file: string): Promise<string | undefined> => {
    setLoading(true);
    setError(null);

    const response = await httpGet<IFetchFileResponse>(`/projects/${projectId}/calculations/${calculationId}/files/${file}`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      return response.val.file_content;
    }

    if (response.err) {
      return;
    }
  };

  return {
    fetchCalculationById,
    fetchLatestCalculation,
    fetchFile,
    startCalculation,
    loading,
    error: error || undefined,
  };
};

export default useCalculation;
export type {ICalculationProfile};
