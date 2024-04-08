import useHttp, {IHttpError, IUseHttp} from 'common/hooks/useHttp';

import config from 'config';
import useAuthentication from './useAuthentication';

export interface IUseApi extends IUseHttp {
}

export default (): IUseApi => {
  const apiBaseUrl = config.baseApiUrl;
  const {accessToken, onUnauthorized} = useAuthentication();

  if (!accessToken) {
    return {...useHttp(apiBaseUrl)};
  }

  return {
    ...useHttp(apiBaseUrl, {
      accessToken: accessToken,
      onUnauthorized,
    }),
  };
};

export type {IHttpError};
