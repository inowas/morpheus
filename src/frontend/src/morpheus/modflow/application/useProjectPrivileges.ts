import {IError, IProjectPrivileges} from '../types';
import {useEffect} from 'react';
import {useApi} from '../incoming';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '../../store';
import {setError, setLoading, setPrivileges} from '../infrastructure/privilegesStore';

interface IUseProjectPrivileges {
  privileges: IProjectPrivileges | null;
  isReadOnly: boolean;
  loading: boolean;
  error: IError | null;
}

type IProjectPrivilegesGetResponse = IProjectPrivileges;

const useProjectPrivileges = (projectId: string): IUseProjectPrivileges => {

  const {privileges, loading, error} = useSelector((state: IRootState) => state.project.privileges);
  const dispatch = useDispatch();

  const {httpGet} = useApi();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const fetch = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await httpGet<IProjectPrivilegesGetResponse>(`/projects/${projectId}/privileges`);

      setLoading(false);

      if (result.ok) {
        dispatch(setPrivileges(result.val));
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

  const getIsReadOnly = (priv: IProjectPrivileges | null): boolean => {
    if (!priv) {
      return true;
    }

    if (priv.includes('edit_project')) {
      return false;
    }

    if (priv.includes('manage_project')) {
      return false;
    }

    return !priv.includes('full_access');
  };

  return {
    privileges,
    isReadOnly: getIsReadOnly(privileges),
    loading,
    error,
  };
};


export default useProjectPrivileges;
export type {IUseProjectPrivileges};
