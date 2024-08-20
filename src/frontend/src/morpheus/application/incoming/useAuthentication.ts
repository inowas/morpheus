import {useAuthentication as useAuthenticationHook} from 'morpheus/authentication/outgoing';


interface IUseAuthentication {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useAuthentication = (): IUseAuthentication => {
  const {isAuthenticated, login, logout} = useAuthenticationHook();

  return {
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuthentication;
export type {IUseAuthentication};
