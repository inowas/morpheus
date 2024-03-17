import {INavbarItem} from 'common/components/Navbar/types/navbar.type';
import useTranslate from './useTranslate';
import {useParams, useLocation} from 'react-router-dom';

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

const getProjectNavbarItems = (translate: (key: string) => string, projectId: any): INavbarItem[] => ([
  {
    name: 'project',
    label: translate('Overview'),
    admin: false,
    to: '/projects/' + projectId,
  },
  {
    name: 'basemodel',
    label: translate('Basemodel'),
    admin: false,
    to: '/projects/' + projectId + '/basemodel',
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
  showSearchBar: boolean;
  showButton: boolean;
}

const useNavbarItems = (): IUseNavbarItems => {
  const {translate} = useTranslate();
  const params = useParams();
  const location = useLocation();

  console.log('params', params);
  console.log('location', location);

  const isDashboardPage = location.pathname.includes('projects') && 0 === Object.keys(params).length;
  const isProjectPage = location.pathname.includes('projects') && params.projectId !== undefined;

  if (isDashboardPage) {
    return ({
      navbarItems: getProjectDashboardNavbarItems(translate),
      showSearchBar: true,
      showButton: true,
    });
  }

  if (isProjectPage) {
    return ({
      navbarItems: getProjectNavbarItems(translate, params.projectId),
      showSearchBar: false,
      showButton: false,
    });
  }

  return ({
    navbarItems: [
      {
        name: 'projects',
        label: translate('Projects'),
        admin: false,
        to: '/projects',
      },
      {
        name: 'support',
        label: translate('support'),
        admin: false,
        to: '/support',
      },
      {
        name: 'news',
        label: translate('news'),
        admin: false,
        to: '/news',
      },
    ],
    showSearchBar: false,
    showButton: false,
  });
};

export default useNavbarItems;
export type {IUseNavbarItems};
