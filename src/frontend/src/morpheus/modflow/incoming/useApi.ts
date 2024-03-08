import useHttp, {IHttpError, IUseHttp} from 'common/hooks/useHttp';

import config from 'config';
import useAuthentication from './useAuthentication';
import {IOAuthToken} from '../../authentication/types';

export interface IUseApi extends IUseHttp {
}

export default (): IUseApi => {
  const auth = useAuthentication();
  const apiBaseUrl = config.baseApiUrl;

  return {...useHttp(apiBaseUrl)};
};

export type {IHttpError};
