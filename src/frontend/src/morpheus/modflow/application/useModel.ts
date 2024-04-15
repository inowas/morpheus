import {IError} from '../types';
import {useEffect} from 'react';

import {useApi} from '../incoming';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {IModel} from '../types/Model.type';
import {setError, setLoading, setModel} from '../infrastructure/modelStore';


type IModelState = 'initializing' | 'error' | 'loading' | 'loaded' | 'setup';

interface IUseModel {
  model: IModel | null;
  state: IModelState;
  loading: boolean;
  error: IError | null;
}

const useModel = (projectId: string | undefined): IUseModel => {

  const {model, modelState, loading, error} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();
  const {httpGet} = useApi();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const fetch = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await httpGet<IModel>(`/projects/${projectId}/model`);

      console.log('result', result);

      dispatch(setLoading(false));

      if (result.ok) {
        dispatch(setModel(result.val));
      }

      if (result.err) {
        return dispatch(setError({
          message: result.val.message,
          code: result.val.code,
        }));
      }
    };

    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return {
    error,
    loading,
    model,
    state: modelState,
  };
};

export default useModel;
export type {IUseModel, IModelState};
