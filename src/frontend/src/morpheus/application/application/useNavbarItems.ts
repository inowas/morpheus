import {INavbarItem} from 'common/components/Navbar/types/navbar.type';
import useTranslate from './useTranslate';
import {useParams} from 'react-router-dom';

const getProjectDashboardNavbarItems = (translate: (key: string) => string): INavbarItem[] => ([
  {
    name: 'home',
    label: translate('home'),
    admin: false,
    to: '/',
  },
  {
    name: 'filter',
    label: translate('filter'),
    admin: false,
    to: '#filter',
  },
  {
    name: 'documentation',
    label: translate('documentation'),
    admin: false,
    to: '/documentation',
  },
]);

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
    name: 'assets',
    label: translate('Assets'),
    admin: false,
    to: '/projects/' + projectId + '/assets',
  },
  {
    name: 'event-log',
    label: translate('Event Log'),
    admin: false,
    to: '/projects/' + projectId + '/event-log',
    disabled: !isReadOnly,
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
    ],
  },
]);

interface IUseNavbarItems {
  navbarItems: INavbarItem[];
}

const useNavbarItems = (isReadOnly: boolean = false): IUseNavbarItems => {
  const {translate} = useTranslate();

  const {projectId} = useParams();
  const isDashboardPage = projectId === undefined;
  const navbarItems: INavbarItem[] = isDashboardPage ? getProjectDashboardNavbarItems(translate) : getProjectNavbarItems(translate, projectId, isReadOnly);

  return ({
    navbarItems,
  });
};

export default useNavbarItems;
export type {IUseNavbarItems};
