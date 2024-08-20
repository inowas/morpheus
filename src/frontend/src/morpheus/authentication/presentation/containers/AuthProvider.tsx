import React from 'react';
import config from 'config';
import {OidcProvider, TokenAutomaticRenewMode, TokenRenewMode} from '@axa-fr/react-oidc';

export const configurationIdentityServer = {
  client_id: config.keycloak.clientId,
  redirect_uri: window.location.origin + '/auth/callback',
  silent_redirect_uri: window.location.origin + '/auth/silent-callback',
  silent_login_uri: window.location.origin + '/auth/silent-login',
  scope: 'openid address basic email profile offline_access',
  authority: `${config.keycloak.url}/realms/${config.keycloak.realm}`,
  // authority_time_cache_wellknowurl_in_second: 60* 60,
  refresh_time_before_tokens_expiration_in_second: 40,
  //service_worker_relative_url: '/OidcServiceWorker.js',
  service_worker_only: false,
  storage: localStorage,
  // silent_login_timeout: 3333000
  monitor_session: true,
  token_renew_mode: TokenRenewMode.access_token_or_id_token_invalid,
  token_automatic_renew_mode: TokenAutomaticRenewMode.AutomaticBeforeTokenExpiration,
  demonstrating_proof_of_possession: false,
  preload_user_info: true,
};

interface IProps {
  children: React.ReactNode;
}

const onEvent = (configurationName: string, eventName: string, data: object) => {
  if (!config.debug) {
    return;
  }
  console.log(`oidc:${configurationName}:${eventName}`, data);
};

const AuthProvider = ({children}: IProps) => {
  return (
    <OidcProvider configuration={configurationIdentityServer} onEvent={onEvent} >
      {children}
    </OidcProvider>
  );
};

export default AuthProvider;
