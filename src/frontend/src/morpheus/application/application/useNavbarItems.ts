import {INavbarItem} from 'common/components/Navbar/types/navbar.type';
import useTranslate from './useTranslate';

const getProjectNavbarItems = (translate: (key: string) => string, projectId: string, isReadOnly: boolean): INavbarItem[] => ([
  {
    name: 'project',
    label: translate('Overview'),
    admin: false,
    to: '/projects/' + projectId,
  },
  {
    name: 'model',
    label: translate('Model'),
    admin: false,
    to: '/projects/' + projectId + '/model',
  },
  {
    name: 'scenarios',
    label: translate('Scenarios'),
    admin: false,
    to: '/projects/' + projectId + '/scenarios',
  },
  {
    name: 'calculations',
    label: translate('Calculations'),
    admin: false,
    to: '/projects/' + projectId + '/calculations',
  },
  {
    name: 'assets',
    label: translate('Assets'),
    admin: false,
    to: '/projects/' + projectId + '/assets',
  },
  {
    name: 'settings',
    label: translate('Settings'),
    admin: false,
    basepath: '/projects/' + projectId + '/settings',
    subMenu: [
      {
        name: 'general',
        label: translate('General'),
        admin: false,
        to: '/projects/' + projectId + '/settings/general',
      },
      {
        name: 'permissions',
        label: translate('Permissions'),
        admin: false,
        to: '/projects/' + projectId + '/settings/permissions',
      },
      {
        name: 'event-log',
        label: translate('Event Log'),
        admin: false,
        to: '/projects/' + projectId + '/event-log',
        disabled: !isReadOnly,
      },
    ],
  },
]);

interface IUseNavbarItems {
  navbarItems: INavbarItem[];
}

const useNavbarItems = (projectId: string, isReadOnly: boolean = false): IUseNavbarItems => {
  const {translate} = useTranslate();
  const navbarItems: INavbarItem[] = getProjectNavbarItems(translate, projectId, isReadOnly);

  return ({
    navbarItems,
  });
};

export default useNavbarItems;
export type {IUseNavbarItems};
