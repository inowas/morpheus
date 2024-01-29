import {IOAuthToken} from '../types';

interface IUseAuth {
  token: IOAuthToken;
  onUnauthorized: () => void;
  onRefreshToken: (token: IOAuthToken) => Promise<IOAuthToken>;
  updateToken: (token: IOAuthToken) => void;
}

const token: IOAuthToken = {
  access_token: '',
  expires_in: 0,
  token_type: '',
  scope: null,
  refresh_token: '',
  user_id: 0,
};

const useAuth = (): IUseAuth => {
  const onUnauthorized = () => ({});

  const onRefreshToken = (): Promise<IOAuthToken> => {
    return (
      new Promise<IOAuthToken>(async (resolve) => {
        resolve(token);
      })
    );
  };

  return {
    token,
    onRefreshToken,
    onUnauthorized,
    updateToken: (t: IOAuthToken) => ({token: t}),
  };
};

export default useAuth;
export type {IUseAuth, IOAuthToken};
