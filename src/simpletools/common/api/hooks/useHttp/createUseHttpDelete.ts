import {useEffect, useRef, useState} from 'react';
import {IHttpError} from './useHttp';
import {Result} from 'ts-results';

export type IUseDelete = [{ deleted: boolean, loading: boolean; error: IHttpError | null }, (url: string) => void];

const createUseHttpDelete = (httpDelete: (url: string) => Promise<Result<void, IHttpError>>) => (): IUseDelete => {

  const isMounted = useRef<boolean>(true);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IHttpError | null>(null);

  const deleteData = async (url: string) => {
    if (!isMounted.current) {
      return null;
    }
    setError(null);
    setLoading(true);
    setDeleted(false);

    const result = await httpDelete(url);

    if (!isMounted.current) {
      return null;
    }

    if (result.ok) {
      setDeleted(true);
    }

    if (result.err) {
      setError(result.val);
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return [{deleted, loading, error}, deleteData];
};

export default createUseHttpDelete;
