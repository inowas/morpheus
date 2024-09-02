import * as process from 'process';

const config = {
  baseApiUrl: process.env.BASE_API_URL || 'http://localhost:4000/api/v1',
  modflowApiUrl: process.env.MODFLOW_API_URL || 'https://modflow.inowas.com',
  release: process.env.GIT_RELEASE || 'dev',
  releaseDate: process.env.GIT_RELEASE_DATE || 'unknown',
  keycloak: {
    url: process.env.KEYCLOAK_URL || 'https://identity.inowas.com',
    realm: process.env.KEYCLOAK_REALM || 'inowas-dev',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'morpheus-frontend',
  },
  debug: window.location.search.includes('debug=true') || 'true' === process.env.DEBUG || false,
  sentry: {
    enabled: 'true' === process.env.SENTRY_ENABLED || false,
    dsn: process.env.SENTRY_DSN || '',
  },
};

export default config;
