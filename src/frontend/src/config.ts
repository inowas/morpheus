import * as process from 'process';

const getIdentityServerUrl = () => {
  if (process.env.IDENTITY_SERVER_URL) {
    return process.env.IDENTITY_SERVER_URL;
  }

  const hostname = window.location.hostname;
  // Legacy support for Morpheus
  if (hostname.includes('morpheus.inowas.com')) {
    return 'https://identity.inowas.com';
  }

  return `//identity.${hostname}`;
};


const config = {
  baseApiUrl: process.env.BASE_API_URL || `//api.${window.location.hostname}`,
  modflowApiUrl: process.env.MODFLOW_API_URL || 'https://modflow.inowas.com',
  release: process.env.GIT_RELEASE || 'dev',
  releaseDate: process.env.GIT_RELEASE_DATE || 'unknown',
  keycloak: {
    url: getIdentityServerUrl(),
    realm: process.env.KEYCLOAK_REALM || 'inowas',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'inowas-frontend',
  },
  debug: window.location.search.includes('debug=true') || 'true' === process.env.DEBUG || false,
  sentry: {
    enabled: 'true' === process.env.SENTRY_ENABLED || false,
    dsn: process.env.SENTRY_DSN || '',
  },
};

export default config;
