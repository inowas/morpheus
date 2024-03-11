import React from 'react';
import {AuthProvider as AuthProviderBase, AuthProviderProps} from 'react-oidc-context';
import {WebStorageStateStore} from 'oidc-client-ts';
import config from 'config';

const oidcConfig: AuthProviderProps = {
  authority: `${config.keycloak.url}/realms/${config.keycloak.realm}`,
  client_id: config.keycloak.clientId,
  redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({store: window.sessionStorage}),
  automaticSilentRenew: true,
  post_logout_redirect_uri: `${window.location.origin}`,
  onSigninCallback() {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

interface IProps {
  children: React.ReactNode;
}

const AuthProvider = ({children}: IProps) => (
  <AuthProviderBase {...oidcConfig}>
    {children}
  </AuthProviderBase>
);

export default AuthProvider;
