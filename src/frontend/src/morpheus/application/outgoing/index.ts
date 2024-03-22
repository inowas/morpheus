import useIsEmbedded from '../application/useIsEmbedded';
import useTranslate from '../application/useTranslate';

const useShowBreadcrumbs = (): boolean => {
  const {isEmbedded} = useIsEmbedded();
  return !isEmbedded;
};
export {
  useShowBreadcrumbs,
  useTranslate,
};
