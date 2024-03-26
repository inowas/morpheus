import React from 'react';
import {AuthProvider as AuthProviderBase, AuthProviderProps} from 'react-oidc-context';
import {WebStorageStateStore} from 'oidc-client-ts';
import config from 'config';

const oidcConfig: AuthProviderProps = {
  authority: `${config.keycloak.url}/realms/${config.keycloak.realm}`,
  automaticSilentRenew: true,
  client_id: config.keycloak.clientId,
  post_logout_redirect_uri: `${window.location.origin}/auth`,
  redirect_uri: `${window.location.origin}/auth/callback`,
  userStore: new WebStorageStateStore({store: window.sessionStorage}),
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
