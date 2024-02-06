const config = {
  baseApiUrl: process.env.BASE_API_URL || 'http://localhost:4000/api/v1',
  modflowApiUrl: process.env.MODFLOW_API_URL || 'https://modflow.inowas.com',
  release: process.env.GIT_RELEASE || 'dev',
  releaseDate: process.env.GIT_RELEASE_DATE || 'unknown',
  mockServerEnabled: !!process.env.MOCKSERVER_ENABLED,
};

export default config;

