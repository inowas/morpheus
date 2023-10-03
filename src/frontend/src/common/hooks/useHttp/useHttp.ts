import {useMemo} from 'react';
import axios, {AxiosError, AxiosHeaders, InternalAxiosRequestConfig} from 'axios';
import {Err, Ok, Result} from 'ts-results';

export interface IOAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string | null;
  refresh_token: string;
  user_id: number;
}

export interface IHttpError {
  code: number;
  message: string;
  response?: AxiosError['response'];
}

export interface IHttpPostResponse {
  location: string | undefined;
}

export interface IUseHttp {
  httpGet: <T>(url: string) => Promise<Result<T, IHttpError>>;
  httpPatch: <T>(url: string, data: T) => Promise<Result<void, IHttpError>>;
  httpPost: <T>(url: string, data: T) => Promise<Result<IHttpPostResponse, IHttpError>>;
  httpPut: <T>(url: string, data: T) => Promise<Result<void, IHttpError>>;
  httpDelete: (url: string) => Promise<Result<void, IHttpError>>;
}

interface IAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const useHttp = (apiBaseUrl: string, auth?: {
  token: IOAuthToken,
  onRefreshToken: (token: IOAuthToken) => Promise<IOAuthToken>,
  onUnauthorized: () => void,
}): IUseHttp => {

  const axiosInstance = useMemo(() => {
    const instance = axios.create({});
    instance.interceptors.request.use((config: IAxiosRequestConfig) => {
      if (config._retry) {
        return config;
      }

      config.baseURL = apiBaseUrl;
      config.headers = new AxiosHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });

      if (!config.data) {
        config.data = {};
      }

      if (auth) {
        config.headers.Authorization = `Bearer ${auth.token.access_token}`;
      }

      if (config.url && config.url.startsWith(config.baseURL)) {
        config.url = config.url.replace(config.baseURL, '');
      }

      return config;
    });

    if (auth) {
      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (401 === error.response.status && !originalRequest._retry) {
            const newToken = await auth?.onRefreshToken(auth?.token);
            originalRequest.headers.Authorization = 'Bearer ' + newToken.access_token;
            originalRequest._retry = true;
            return instance(originalRequest);
          }

          if (401 === error.response.status && originalRequest._retry) {
            return auth.onUnauthorized();
          }

          return Promise.reject(error);
        });
    }

    return instance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, auth?.token]);

  const httpGet = async <T>(url: string): Promise<Result<T, IHttpError>> => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: url,
        withCredentials: false,
        validateStatus: (status) => 200 === status,
        data: {},
      });
      return Ok(response.data as T);
    } catch (error) {
      const axiosError = error as AxiosError;
      return Err({
        code: axiosError?.response?.status || 500,
        message: axiosError.message,
        response: axiosError?.response,
      });
    }
  };

  const httpPost = async <T>(url: string, data: T): Promise<Result<IHttpPostResponse, IHttpError>> => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: url,
        withCredentials: false,
        validateStatus: (status) => 201 === status,
        data: data,
      });
      return Ok({
        location: response?.headers?.location,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      return Err({
        code: axiosError?.response?.status || 500,
        message: axiosError.message,
        response: axiosError?.response,
      });
    }
  };

  const httpPut = async <T>(url: string, data: T): Promise<Result<void, IHttpError>> => {
    try {
      await axiosInstance({
        method: 'PUT',
        url: url,
        withCredentials: false,
        validateStatus: (status) => 204 === status,
        data: data,
      });
      return Ok(undefined);
    } catch (error) {
      const axiosError = error as AxiosError;
      return Err({
        code: axiosError?.response?.status || 500,
        message: axiosError.message,
        response: axiosError?.response,
      });
    }
  };

  const httpPatch = async <T>(url: string, data: T): Promise<Result<void, IHttpError>> => {
    try {
      await axiosInstance({
        method: 'PATCH',
        url: url,
        withCredentials: false,
        validateStatus: (status) => 204 === status,
        data: data,
      });
      return Ok(undefined);
    } catch (error) {
      const axiosError = error as AxiosError;
      return Err({
        code: axiosError?.response?.status || 500,
        message: axiosError.message,
        response: axiosError?.response,
      });
    }
  };

  const httpDelete = async (url: string): Promise<Result<void, IHttpError>> => {
    try {
      await axiosInstance({
        method: 'DELETE',
        url: url,
        withCredentials: false,
        validateStatus: (status) => 204 === status,
      });
      return Ok(undefined);
    } catch (error) {
      const axiosError = error as AxiosError;
      return Err({
        code: axiosError?.response?.status || 500,
        message: axiosError.message,
        response: axiosError?.response,
      });
    }
  };

  return {
    httpDelete,
    httpGet,
    httpPatch,
    httpPost,
    httpPut,
  };
};

export default useHttp;
