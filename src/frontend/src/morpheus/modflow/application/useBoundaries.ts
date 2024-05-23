import {IError} from '../types';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {IBoundary, IBoundaryId, IBoundaryType} from "../types/Boundaries.type";
import {useApi} from "../incoming";
import useProjectCommandBus, {Commands} from "./useProjectCommandBus";
import {setBoundaries} from "../infrastructure/modelStore";
import {LineString, Point, Polygon} from "geojson";

interface IUseBoundaries {
  boundaries: IBoundary[];
  onAddBoundary: (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => Promise<void>;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onRemoveBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onUpdateBoundary: (boundary: IBoundary) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

type IGetBoundariesResponse = IBoundary[];

const useBoundaries = (projectId: string): IUseBoundaries => {

  const {model} = useSelector((state: IRootState) => state.project.model);
  const dispatch = useDispatch();

  const isMounted = useRef(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const fetchBoundaries = async () => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const result = await httpGet<IGetBoundariesResponse>(`/projects/${projectId}/model/boundaries`);

    if (!isMounted.current) {
      return;
    }

    setLoading(false);

    if (result.ok) {
      dispatch(setBoundaries(result.val));
    }

    if (result.err) {
      setError({
        message: result.val.message,
        code: result.val.code,
      });
    }
  };

  useEffect(() => {
    if (!projectId) {
      return;
    }

    fetchBoundaries();

    return (): void => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, [projectId]);

  const onAddBoundary = async (boundary_type: IBoundaryType, geometry: Point | Polygon | LineString) => {
    if (!model || !projectId) {
      return;
    }


    setLoading(true);
    setError(null);


    const addBoundaryResult = await sendCommand<Commands.IAddModelBoundaryCommand>({
      command_name: 'add_model_boundary_command',
      payload: {
        project_id: projectId,
        model_id: model.model_id,
        boundary_type: boundary_type,
        boundary_geometry: geometry,
      }
    });

    setLoading(false);

    if (addBoundaryResult.err) {
      setError({
        message: addBoundaryResult.val.message,
        code: addBoundaryResult.val.code,
      });
    }

    await fetchBoundaries();
  }

  const onCloneBoundary = async (boundaryId: IBoundaryId) => {
  }

  const onRemoveBoundary = async (boundaryId: IBoundaryId) => {

    return new Promise<void>(async (resolve, reject) => {
      if (!model || !projectId) {
        return;
      }

      setLoading(true);
      setError(null);


      const removeBoundaryResult = await sendCommand<Commands.IRemoveModelBoundaryCommand>({
        command_name: 'remove_model_boundary_command',
        payload: {
          project_id: projectId,
          model_id: model.model_id,
          boundary_id: boundaryId,
        }
      });

      if (removeBoundaryResult.err) {
        setError({
          message: removeBoundaryResult.val.message,
          code: removeBoundaryResult.val.code,
        });
      }

      setLoading(false);
      await fetchBoundaries();
      resolve();
    })
  }

  const onUpdateBoundary = async (boundary: IBoundary) => {
  }

  return {
    boundaries: model?.boundaries || [],
    onAddBoundary,
    onCloneBoundary,
    onRemoveBoundary,
    onUpdateBoundary,
    loading,
    error,
  };
};

export default useBoundaries;
export type {IUseBoundaries};
