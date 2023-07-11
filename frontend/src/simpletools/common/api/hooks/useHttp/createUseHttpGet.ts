import {useEffect, useRef, useState} from 'react';
import {Result} from 'ts-results';
import {IHttpError} from './useHttp';

export type IUseGet<T> = [{ data: T; loading: boolean; error: IHttpError | null }, (url: string) => void, () => void];

const createUseHttpGet = (httpGet: <T>(url: string) => Promise<Result<T, IHttpError>>) => <T>(initialUrl: string, initialData: T): IUseGet<T> => {

  const isMounted = useRef(true);
  const [data, setData] = useState<T>(initialData);
  const [url, setUrl] = useState<string>(initialUrl);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IHttpError | null>(null);

  const fetchData = async () => {
    if (!isMounted.current) {
      return null;
    }
    
    setError(null);
    setLoading(true);

    const result = await httpGet<T>(url);
    if (!isMounted.current) {
      return null;
    }

    if (result.ok) {
      setData(result.val);
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);


  return [{data, loading, error}, setUrl, fetchData];
};

export default createUseHttpGet;
