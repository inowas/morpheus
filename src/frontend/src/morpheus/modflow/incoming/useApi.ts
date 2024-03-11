import useHttp, {IHttpError, IUseHttp} from 'common/hooks/useHttp';

import config from 'config';

export interface IUseApi extends IUseHttp {
}

export default (): IUseApi => {
  const apiBaseUrl = config.baseApiUrl;

  return {...useHttp(apiBaseUrl)};
};

export type {IHttpError};
