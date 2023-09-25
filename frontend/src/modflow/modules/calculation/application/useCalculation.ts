import useHttp, {IHttpError} from 'common/hooks/useHttp';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'modflow/store';
import {setCalculation, setError, setLoading} from '../infrastructure/store';
import {getConfig} from 'config';

interface ICalculation {
  calculation_id: string;
  state: number;
  message: string;
  files: string[];
  times: {
    start_date_time: string;
    time_unit: number;
    total_times?: number[];
    head: IAvailableValues;
    budget: IAvailableValues;
    concentration: IAvailableValues;
    drawdown: IAvailableValues;
  };
  layer_values: ILayerValues;
}

interface IAvailableValues {
  idx: number[];
  total_times: number[];
  kstpkper: [number, number][];
  layers: ILayerValues;
}

type ILayerValues = ['head' | 'budget' | 'drawdown'][];


interface IUseCalculation {
  calculation: ICalculation | null;
  error: IHttpError | null;
  loading: boolean;
  updateCalculationId: (calculationId: string) => Promise<void>;
  getTopElevationUrls: () => { dataUrl: string, imgUrl: string } | null;
  getResultUrls: (layer: number, type: 'budget' | 'head', timestepIdx: number) => { dataUrl: string, imgUrl: string } | null;
}

const {modflowApiUrl} = getConfig();


const useCalculation = (id?: string): IUseCalculation => {
  const {httpGet} = useHttp(modflowApiUrl);
  const {calculation, error, loading} = useSelector((state: RootState) => state.calculation);
  const dispatch = useDispatch();

  const getTopElevationUrls = () => {
    if (!calculation) {
      return null;
    }
    return ({
      dataUrl: `${modflowApiUrl}/${calculation.calculation_id}/elevations/top?output=json`,
      imgUrl: `${modflowApiUrl}/${calculation.calculation_id}/elevations/top?output=image`,
    });
  };

  const getResultUrls = (layer: number = 1, type: 'budget' | 'head' = 'head', timestepIdx: number = 0) => {
    if (!calculation) {
      return null;
    }
    return ({
      dataUrl: `${modflowApiUrl}/${calculation.calculation_id}/results/types/${type}/layers/${layer}/idx/${timestepIdx}?output=json`,
      imgUrl: `${modflowApiUrl}/${calculation.calculation_id}/results/types/${type}/layers/${layer}/idx/${timestepIdx}?output=image`,
    });
  };

  const updateCalculationId = async (idToUpdate: string): Promise<void> => {
    if (idToUpdate === calculation?.calculation_id) {
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const result = await httpGet<ICalculation>(`/${idToUpdate}`);
    dispatch(setLoading(false));

    if (result.err) {
      setError(result.val);
      return;
    }

    dispatch(setCalculation(result.val));
    return;
  };

  useEffect(() => {
    if (id) {
      updateCalculationId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    calculation,
    error,
    loading,
    updateCalculationId,
    getTopElevationUrls,
    getResultUrls,
  };
};

export {useCalculation};
export type {IHttpError, ICalculation, IUseCalculation};
