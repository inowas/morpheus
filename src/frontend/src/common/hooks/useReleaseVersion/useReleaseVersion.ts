import config from '../../../config';

interface IUseReleaseVersion {
  release: string;
  releaseDate: string;
}

const useReleaseVersion = (): IUseReleaseVersion => ({
  release: config.release,
  releaseDate: config.releaseDate,
});

export default useReleaseVersion;
export type {IUseReleaseVersion};
