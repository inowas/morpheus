import {useEffect, useRef, useState} from 'react';
import {Result} from 'ts-results';
import {IHttpError} from './useHttp';

export type IUsePut<T> = [{ success: boolean, loading: boolean; error: IHttpError | null }, (url: string, data: T) => void];

const createUseHttpPut = (httpPut: <T>(url: string, data: T) => Promise<Result<void, IHttpError>>) => <T>(): IUsePut<T> => {

  const isMounted = useRef<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IHttpError | null>(null);

  const putData = async (url: string, data: T) => {
    if (!isMounted.current) {
      return null;
    }
    setError(null);
    setSuccess(false);
    setLoading(true);

    const result = await httpPut<T>(url, data);
    if (!isMounted.current) {
      return null;
    }

    if (result.ok) {
      setSuccess(true);
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

  return [{success, loading, error}, putData];
};

export default createUseHttpPut;
