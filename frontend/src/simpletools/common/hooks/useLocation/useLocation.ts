import {useLocation as useLocationHook} from 'react-router-dom';
import {Location} from 'history';

interface IUseLocation {
  location: Location,
  pathnameItems: string[],
}

const useLocation = (): IUseLocation => {
  const location = useLocationHook();
  const pathnameItems = location.pathname.split('/').filter((item) => '' !== item);
  return {location, pathnameItems};
};

export default useLocation;

export type {IUseLocation};
