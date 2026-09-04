import {useCallback, useEffect, useState} from 'react';

import {IError} from '../../types';
import {useApi} from '../incoming';

export interface IGroup {
  group_id: string;
  group_name: string;
  members: string[];
  admins: string[];
}

interface IUseGroups {
  groups: IGroup[];
  loading: boolean;
  error: IError | null;
  reload: () => Promise<void>;
}

const useGroups = (): IUseGroups => {
  const {httpGet} = useApi();

  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await httpGet<IGroup[]>('/users/groups');
    setLoading(false);

    if (result.ok) {
      setGroups(result.val);
    }

    if (result.err) {
      setError({message: result.val.message, code: result.val.code});
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    reload: fetchGroups,
  };
};

export default useGroups;
export type {IUseGroups};
