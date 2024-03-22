import useIsEmbedded from '../application/useIsEmbedded';

const useShowBreadcrumbs = (): boolean => {
  const {isEmbedded} = useIsEmbedded();
  return !isEmbedded;
};

export default useShowBreadcrumbs;
