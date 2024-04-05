import {ICreateModelCommand, IError, ILengthUnit} from '../types';

import {useApi} from '../incoming';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setError, setLoading, setModel} from '../infrastructure/modelStore';
import {IModel} from '../types/Model.type';
import {Polygon} from 'geojson';

interface ICreateGrid {
  n_cols: number;
  n_rows: number;
  rotation: number;
  length_unit: ILengthUnit;
}

export interface ICreateModel {
  geometry: Polygon;
  grid_properties: ICreateGrid;
  length_unit: ILengthUnit;
}

interface IUseModelSetup {
  model: IModel | null;
  createModel: (data: ICreateModel) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

const useModelSetup = (projectId: string | undefined): IUseModelSetup => {

  const {model, loading, error} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();
  const {httpGet, httpPost} = useApi();


  const createModel = async (data: ICreateModel) => {

    if (!projectId) {
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    const createModelCommand: ICreateModelCommand = {
      command_name: 'create_model_command',
      payload: {
        project_id: projectId,
        geometry: data.geometry,
        n_cols: data.grid_properties.n_cols,
        n_rows: data.grid_properties.n_rows,
        rotation: data.grid_properties.rotation,
      },
    };

    const createModelResult = await httpPost<ICreateModelCommand>('/projects/messagebox', createModelCommand);
    dispatch(setLoading(false));

    if (createModelResult.err) {
      dispatch(
        setError({
          message: createModelResult.val.message,
          code: createModelResult.val.code,
        }));
      return;
    }

    if (createModelResult.ok) {
      const fetchModelResult = await httpGet<IModel>(`/projects/${projectId}/model`);
      dispatch(setLoading(false));

      if (fetchModelResult.ok) {
        dispatch(setModel(fetchModelResult.val));
      }

      if (fetchModelResult.err) {
        dispatch(setError({
          message: fetchModelResult.val.message,
          code: fetchModelResult.val.code,
        }));
      }
    }
  };

  return {
    model,
    createModel,
    loading,
    error,
  };
};

export default useModelSetup;
export type {IUseModelSetup};
