import {IError, IProjectPermissions} from '../types';
import {useEffect} from 'react';
import {useApi} from '../incoming';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setError, setLoading, setPermissions} from '../infrastructure/permissionsStore';

interface IUseProjectPermissions {
  permissions: IProjectPermissions | null;
  isReadOnly: boolean;
  loading: boolean;
  error: IError | null;
}

type IProjectPermissionsGetResponse = IProjectPermissions;

const useProjectPermissions = (projectId: string): IUseProjectPermissions => {

  const {permissions, loading, error} = useSelector((state: IRootState) => state.project.permissions);
  const dispatch = useDispatch();

  const {httpGet} = useApi();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const fetch = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await httpGet<IProjectPermissionsGetResponse>(`/projects/${projectId}/permissions`);

      setLoading(false);

      if (result.ok) {
        dispatch(setPermissions(result.val));
      }

      if (result.err) {
        setError({
          message: result.val.message,
          code: result.val.code,
        });
      }
    };

    fetch();

    // eslint-disable-next-line
  }, [projectId]);

  const isReadOnly = permissions ? !permissions.can_edit : false;

  return {
    permissions,
    isReadOnly,
    loading,
    error,
  };
};


export default useProjectPermissions;
export type {IUseProjectPermissions};
