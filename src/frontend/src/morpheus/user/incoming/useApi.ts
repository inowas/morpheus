import useHttp, {IHttpError, IUseHttp} from 'common/hooks/useHttp';
import config from 'config';
import useAuth from './useAuth';

export interface IUseApi extends IUseHttp {
}

export default (): IUseApi => {
  const auth = useAuth();
  const apiBaseUrl = config.baseApiUrl;
  return {...useHttp(apiBaseUrl, auth)};
};

export type {IHttpError};
