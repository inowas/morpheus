import {useEffect, useRef, useState} from 'react';
import {Result} from 'ts-results';
import {IHttpError, IHttpPostResponse} from './useHttp';

export type IUsePost<T> = [{ location?: string; loading: boolean; error: IHttpError | null }, (url: string, data: T) => void];

const createUseHttpPost = (httpPost: <T>(url: string, data: T) => Promise<Result<IHttpPostResponse, IHttpError>>) => <T>(): IUsePost<T> => {

  const isMounted = useRef<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<string | undefined>(undefined);
  const [error, setError] = useState<IHttpError | null>(null);

  const postData = async (url: string, data: T) => {
    if (!isMounted.current) {
      return null;
    }
    setError(null);
    setNewLocation(undefined);
    setLoading(true);

    const result = await httpPost<T>(url, data);

    if (!isMounted.current) {
      return null;
    }

    if (result.ok) {
      setNewLocation(result.val.location);
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

  return [{location: newLocation, loading, error}, postData];
};

export default createUseHttpPost;
