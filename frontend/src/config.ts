const config = {
  baseApiUrl: process.env.REACT_APP_BASE_API_URL || 'http://localhost:4000',
  modflowApiUrl: process.env.REACT_APP_MODFLOW_API_URL || 'https://modflow.inowas.com',
  release: process.env.GIT_RELEASE || 'dev',
  releaseDate: process.env.GIT_RELEASE_DATE || 'unknown',
};

const getConfig = () => {
  return config;
};

export default config;
export {getConfig};

