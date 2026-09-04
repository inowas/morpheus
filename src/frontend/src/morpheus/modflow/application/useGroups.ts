import {useEffect, useState} from 'react';

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
}

const useGroups = (): IUseGroups => {
  const {httpGet} = useApi();

  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
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
    };

    fetchGroups();
    // eslint-disable-next-line
  }, []);

  return {
    groups,
    loading,
    error,
  };
};

export default useGroups;
export type {IUseGroups};
