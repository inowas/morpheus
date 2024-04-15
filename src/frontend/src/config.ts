import * as process from 'process';

const config = {
  baseApiUrl: process.env.BASE_API_URL || 'http://localhost:4000/api/v1',
  modflowApiUrl: process.env.MODFLOW_API_URL || 'https://modflow.inowas.com',
  release: process.env.GIT_RELEASE || 'dev',
  releaseDate: process.env.GIT_RELEASE_DATE || 'unknown',
  mockServerEnabled: !!process.env.MOCKSERVER_ENABLED,
  keycloak: {
    url: process.env.KEYCLOAK_URL || 'https://identity.inowas.com',
    realm: process.env.KEYCLOAK_REALM || 'inowas-dev',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'morpheus-frontend',
  },
};

export default config;
