const config = {
  baseApiUrl: process.env.REACT_APP_BASE_API_URL || 'http://localhost:4000',
  release: process.env.GIT_RELEASE || 'dev',
  releaseDate: process.env.GIT_RELEASE_DATE || 'unknown',
};

export default config;
