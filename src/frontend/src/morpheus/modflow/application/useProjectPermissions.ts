import {useEffect, useState} from 'react';

import {IError} from '../../types';
import {useApi} from '../incoming';

export interface IProjectPermissions {
  owner_id: string;
  groups: Record<string, 'viewer' | 'editor' | 'admin' | 'owner'>;
  members: Record<string, 'viewer' | 'editor' | 'admin' | 'owner'>;
  visibility: 'public' | 'private';
}

interface IUseProjectPermissions {
  permissions: IProjectPermissions | null;
  loading: boolean;
  error: IError | null;
}

const useProjectPermissions = (projectId: string): IUseProjectPermissions => {
  const {httpGet} = useApi();

  const [permissions, setPermissions] = useState<IProjectPermissions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const fetchPermissions = async () => {
      setLoading(true);
      setError(null);
      const result = await httpGet<IProjectPermissions>(`/projects/${projectId}/permissions`);
      setLoading(false);

      if (result.ok) {
        setPermissions(result.val);
      }

      if (result.err) {
        setError({message: result.val.message, code: result.val.code});
      }
    };

    fetchPermissions();
    // eslint-disable-next-line
  }, [projectId]);

  return {
    permissions,
    loading,
    error,
  };
};

export default useProjectPermissions;
export type {IUseProjectPermissions};
