import {useEffect, useRef, useState} from 'react';
import {ICalculation, ICalculationId} from '../types/Calculation.type';
import {useApi} from '../incoming';
import useProjectCommandBus from './useProjectCommandBus';
import {IStartCalculationCommand} from './useProjectCommandBus.type';
import {IModel} from '../types/Model.type';
import {useDispatch} from 'react-redux';
import {setCalculation} from '../infrastructure/calculationsStore';


interface IUseCalculate {
  calculation: ICalculation | null;
  fetchFileContent: (file: string) => Promise<string | undefined>;
  startCalculation: (modelId: IModel['model_id']) => Promise<ICalculationId | undefined>;
  loading: boolean;
  waiting: boolean;
  error: string | null;
}

type ICalculationResponse = ICalculation;

interface IFetchFileContentResponse {
  file_name: string;
  file_content: string;
}


const useCalculate = (projectId: string): IUseCalculate => {

  const [calculationId, setCalculationId] = useState<ICalculationId | null>(null);
  const [calculation, setCalculationState] = useState<ICalculation | null>(null);

  const [waiting, setWaiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();
  const dispatch = useDispatch();

  const isMounted = useRef(true);

  const fetchCalculation = async (id: ICalculationId | 'latest'): Promise<void> => {
    setLoading(true);
    setError(null);

    let url = `/projects/${projectId}/model/calculation`;
    if ('latest' !== id) {
      url = `/projects/${projectId}/calculations/${id}`;
    }

    const response = await httpGet<ICalculationResponse>(url);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (response.ok) {
      const fetchedCalculation = response.val;
      setCalculationId(fetchedCalculation.calculation_id);
      setCalculationState(response.val);
      if (['created', 'queued', 'preprocessing', 'preprocessed', 'calculating'].includes(fetchedCalculation.state)) {
        setTimeout(() => fetchCalculation(id), 1000);
        setWaiting(true);
        return;
      }
      dispatch(setCalculation(response.val));
      setWaiting(false);
    }

    if (response.err) {
      setError(response.val.message);
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!calculationId) {
      fetchCalculation('latest');
      return;
    }

    fetchCalculation(calculationId);

    // eslint-disable-next-line
  }, [calculationId]);

  const startCalculation = async (modelId: IModel['model_id']): Promise<string | undefined> => {

    if (!isMounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const command: IStartCalculationCommand = {
      command_name: 'start_calculation_command', payload: {
        project_id: projectId,
        model_id: modelId,
      },
    };

    const result = await sendCommand(command);
    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      const newCalculationId = result.val?.split('/').pop();
      if (newCalculationId) {
        setCalculationId(newCalculationId);
        setWaiting(true);
        return newCalculationId;
      }

      setError('Calculation ID not returned in location header');
    }

    if (result.err) {
      setError(result.val.message);
    }
  };

  const fetchFileContent = async (file: string): Promise<string | undefined> => {
    setLoading(true);
    setError(null);

    const response = await httpGet<IFetchFileContentResponse>(`/projects/${projectId}/calculations/${calculationId}/files/${file}`);

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
    startCalculation,
    fetchFileContent,
    calculation,
    loading,
    waiting,
    error,
  };
};

export default useCalculate;

