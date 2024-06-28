import {useRef, useState} from 'react';
import {IError} from '../../types';
import {useApi} from '../incoming';
import {Feature, Polygon} from 'geojson';

interface IData {
  n_cols: number;
  n_rows: number;
  outline: Feature<Polygon>;
  rotation: number;
  values: number[][];
  min_value: number;
  max_value: number;
}

interface IFlowData {
  type: 'head' | 'drawdown';
  layer_idx: number;
  time_idx: number;
  data: IData;
}

interface IFlowResultResponse {
  result_type: 'flow_head' | 'flow_drawdown'
  layer_idx: number;
  time_idx: number;
  data: IData;
}

interface IConcentrationData {
  layer_idx: number;
  time_idx: number;
  data: IData;
}

interface IConcentrationResponse {
  result_type: 'transport_concentration'
  layer_idx: number;
  time_idx: number;
  data: IData;
}

interface IBudgetData {
  time_idx: number;
  data: number;
}

interface IBudgetResponse {
  result_type: 'flow_budget' | 'transport_budget'
  time_idx: number;
  data: number;
  incremental: boolean;
}


interface IUseCalculationData {
  fetchFlowResult: (calculationId: string, type: 'head' | 'drawdown', layerIdx: number, timeStepIdx: number) => Promise<IFlowData | undefined>;
  fetchConcentrationResult: (calculationId: string, layerIdx: number, timeStepIdx: number) => Promise<IConcentrationData | undefined>;
  fetchBudgetResult: (calculationId: string, type: 'flow' | 'transport', timeIdx: number, incremental: boolean) => Promise<IBudgetData | undefined>;
  loading: boolean;
  error?: IError;
}

const useCalculationData = (projectId: string): IUseCalculationData => {

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();


  const fetchFlowResult = async (calculationId: string, type: 'head' | 'drawdown', layerIdx: number, timeIdx: number): Promise<IFlowData | undefined> => {
    setLoading(true);
    setError(null);

    const url = `/projects/${projectId}/calculations/${calculationId}/results/${'flow_' + type}?layer_idx=${layerIdx}&time_idx=${timeIdx}`;
    const response = await httpGet<IFlowResultResponse>(url);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      console.log(response.val, response.val.data);
      return {
        type,
        layer_idx: response.val.layer_idx,
        time_idx: response.val.time_idx,
        data: response.val.data,
      };
    }

    if (response.err) {
      setError(response.val);
    }
  };

  const fetchConcentrationResult = async (calculationId: string, layerIdx: number, timeIdx: number): Promise<IConcentrationData | undefined> => {
    setLoading(true);
    setError(null);

    const url = `/projects/${projectId}/calculations/${calculationId}/results/transport_concentration?layer_idx=${layerIdx}&time_idx=${timeIdx}`;
    const response = await httpGet<IConcentrationResponse>(url);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      return {
        layer_idx: response.val.layer_idx,
        time_idx: response.val.time_idx,
        data: response.val.data,
      };
    }

    if (response.err) {
      setError(response.val);
    }
  };

  const fetchBudgetResult = async (calculationId: string, type: 'flow' | 'transport', timeIdx: number, incremental: boolean): Promise<IBudgetData | undefined> => {
    setLoading(true);
    setError(null);

    const url = `/projects/${projectId}/calculations/${calculationId}/results/${type + '_budget'}?time_idx=${timeIdx}&incremental=${incremental ? 'true' : 'false'}`;
    const response = await httpGet<IBudgetResponse>(url);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      return {
        time_idx: response.val.time_idx,
        data: response.val.data,
      };
    }

    if (response.err) {
      setError(response.val);
    }
  };

  return {
    fetchFlowResult,
    fetchConcentrationResult,
    fetchBudgetResult,
    loading,
    error: error || undefined,
  };
};

export default useCalculationData;
export type {IFlowData, IConcentrationData, IBudgetData};
