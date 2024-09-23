import {IError, IMetadata} from '../types';
import {useEffect} from 'react';

import {useApi} from '../incoming';
import useProjectCommandBus, {Commands} from './useProjectCommandBus';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setLoading, setMetadata, setError} from '../infrastructure/metadataStore';

interface IUseProjectMetadata {
  metadata: IMetadata | null;
  updateMetadata: (metadata: IMetadata) => Promise<void>;
  loading: boolean;
  error: IError | null;
}

const useProjectMetadata = (projectId: string): IUseProjectMetadata => {

  const {metadata, loading, error} = useSelector((state: IRootState) => state.project.metadata);
  const dispatch = useDispatch();

  const {httpGet} = useApi();
  const {sendCommand} = useProjectCommandBus();

  const updateMetadata = async (md: IMetadata): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const updateMetadataCommand: Commands.IUpdateProjectMetadataCommand = {
      command_name: 'update_project_metadata_command',
      payload: {
        project_id: projectId,
        name: md.name,
        description: md.description,
        tags: md.tags,
      },
    };

    const response = await sendCommand(updateMetadataCommand);

    if (response.ok) {
      dispatch(setMetadata(md));
    }

    if (response.err) {
      dispatch(setError(response.val));
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (!projectId || metadata) {
      return;
    }

    const fetch = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await httpGet<any>(`/projects/${projectId}/metadata`);

      if (result.ok) {
        dispatch(setMetadata(result.val));
      }

      if (result.err) {
        dispatch(setError({
          message: result.val.message,
          code: result.val.code,
        }));
      }

      dispatch(setLoading(false));
    };

    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return {
    updateMetadata,
    metadata,
    loading,
    error,
  };
};

export default useProjectMetadata;
