import {useEffect, useState} from 'react';
import {useApi} from '../incoming';
import {Feature, Polygon} from 'geojson';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setCalculation, setError, setLoading} from '../infrastructure/calculationsStore';
import {ICalculation, ICalculationId} from '../types/Calculation.type';
import {IObservationResult} from '../types/HeadObservations.type';

interface IBudgetData {
  result_type: 'flow' | 'transport';
  time_idx: number;
  data: { [key: string]: number };
  incremental: boolean;
}

type IBudgetResponse = IBudgetData;

interface ILayerData {
  type: 'head' | 'drawdown' | 'concentration';
  layer: number;
  time_idx: number;
  data: {
    n_cols: number;
    n_rows: number;
    outline: Feature<Polygon>;
    rotation: number;
    values: number[][];
    min_value: number;
    max_value: number;
  }
}

type ILayerDataResponse = ILayerData;

interface ITimeSeriesData {
  type: 'head' | 'drawdown' | 'concentration';
  layer: number;
  row: number;
  col: number;
  data: [number, number][];
}

type ITimeSeriesDataResponse = ITimeSeriesData;

type IObservationDataResponse = IObservationResult[];

type ICalculationResponse = ICalculation;


interface IUseCalculationResults {
  calculation: ICalculation | null;
  setCalculationId: (calculationId: string) => void;
  fetchBudgetResult: (type: 'flow' | 'transport', timeIdx: number, incremental: boolean) => Promise<IBudgetData | undefined>;
  fetchLayerResult: (type: 'head' | 'drawdown' | 'concentration', layer: number, timeIdx: number) => Promise<ILayerData | undefined>;
  fetchTimeSeriesResult: (type: 'head' | 'drawdown' | 'concentration', layer: number, row: number, col: number) => Promise<ITimeSeriesData | undefined>;
  fetchObservationResults: (type: 'head') => Promise<IObservationResult[] | undefined>;
  loading: boolean;
  error: string | null;
}

const useCalculationResults = (projectId: string, calculationIdProps?: ICalculationId): IUseCalculationResults => {

  const [calculationId, setCalculationId] = useState<ICalculationId | null>(calculationIdProps || null);
  const {calculations, loading, error} = useSelector((state: IRootState) => state.project.calculations);

  const dispatch = useDispatch();
  const {httpGet} = useApi();

  useEffect(() => {

    const fetchCalculation = async (): Promise<void> => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // fetch latest calculation if no calculationId is set
      let url = `/projects/${projectId}/model/calculation`;

      // fetch calculation by calculationId if set
      if (calculationId) {
        url = `/projects/${projectId}/calculations/${calculationId}`;
      }

      const response = await httpGet<ICalculationResponse>(url);

      dispatch(setLoading(false));

      if (response.ok) {
        dispatch(setCalculation(response.val));
        setCalculationId(response.val.calculation_id);
      }

      if (response.err) {
        dispatch(setError(response.val.message));
      }
    };

    if (!calculationId || !Object.keys(calculations).includes(calculationId)) {
      fetchCalculation();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculationId]);

  const fetchBudgetResult = async (type: 'flow' | 'transport', timeIdx: number, incremental: boolean): Promise<IBudgetData | undefined> => {

    if (!calculationId) {
      dispatch(setError('calculationId is missing'));
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const url = `/projects/${projectId}/calculations/${calculationId}/results/budget/${type}?time_idx=${timeIdx}&incremental=${incremental ? 'true' : 'false'}`;
    const response = await httpGet<IBudgetResponse>(url);

    dispatch(setLoading(false));

    if (response.ok) {
      return response.val;
    }

    if (response.err) {
      setError(response.val.message);
    }
  };

  const fetchLayerResult = async (type: 'head' | 'drawdown' | 'concentration', layer: number, timeIdx: number): Promise<ILayerData | undefined> => {

    if (!calculationId) {
      dispatch(setError('calculationId is missing'));
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const url = `/projects/${projectId}/calculations/${calculationId}/results/layer/${type}?layer_idx=${layer}&time_idx=${timeIdx}`;
    const response = await httpGet<ILayerDataResponse>(url);

    dispatch(setLoading(false));

    if (response.ok) {
      return response.val;
    }

    if (response.err) {
      setError(response.val.message);
    }
  };

  const fetchTimeSeriesResult = async (type: 'head' | 'drawdown' | 'concentration', layer: number, row: number, col: number): Promise<ITimeSeriesData | undefined> => {

    if (!calculationId) {
      dispatch(setError('calculationId is missing'));
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const url = `/projects/${projectId}/calculations/${calculationId}/results/time_series/${type}?layer=${layer}&row=${row}&col=${col}`;
    const response = await httpGet<ITimeSeriesDataResponse>(url);

    dispatch(setLoading(false));

    if (response.ok) {
      return response.val;
    }

    if (response.err) {
      setError(response.val.message);
    }
  };

  const fetchObservationResult = async (type: 'head'): Promise<IObservationResult[] | undefined> => {

    if (!calculationId) {
      dispatch(setError('calculationId is missing'));
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const url = `/projects/${projectId}/calculations/${calculationId}/results/observation/${type}`;
    const response = await httpGet<IObservationDataResponse>(url);

    dispatch(setLoading(false));

    if (response.ok) {
      return response.val;
    }

    if (response.err) {
      setError(response.val.message);
    }
  };

  return {
    calculation: calculations[calculationId || ''] || null,
    setCalculationId,
    fetchBudgetResult,
    fetchLayerResult,
    fetchTimeSeriesResult,
    fetchObservationResults: fetchObservationResult,
    loading,
    error,
  };
};

export default useCalculationResults;
export type {IBudgetData, ILayerData, ITimeSeriesData};
