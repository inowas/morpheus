import {INavbarItem} from '../presentation/components/Navbar/types/navbar.type';
import useTranslate from './useTranslate';

const getNavbarItems = (translate: (key: string) => string): INavbarItem[] => ([
  {
    name: 'home',
    label: translate('home'),
    admin: false,
    basepath: '/',
    subMenu: [
      {
        name: 'about_us',
        label: translate('about_us'),
        admin: false,
        to: '/about-us',
      },
      {
        name: 'software_releases',
        label: translate('software_releases'),
        admin: false,
        to: '/software-releases',
      },
      {
        name: 'publications',
        label: translate('publications'),
        admin: false,
        to: '/publications',
      },
      {
        name: 'projects',
        label: translate('projects'),
        admin: false,
        to: '/projects',
      },
    ],
  },
  {
    name: 'tools',
    label: translate('tools'),
    admin: false,
    basepath: '/tools',
    subMenu: ['T02', 'T04', 'T06', 'T08', 'T09', 'T11', 'T13', 'T14', 'T18'].map((tool) => ({
      name: tool,
      label: `${tool}: ${translate(`${tool}_title`)}`,
      admin: false,
      to: `/tools/${tool}`,
    })),
  },
  {
    name: 'modflow',
    label: translate('modflow'),
    admin: false,
    to: '/modflow',
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
]);

interface IUseNavbarItems {
  navbarItems: INavbarItem[];
}

const useNavbarItems = (): IUseNavbarItems => {
  const {translate} = useTranslate();
  return ({
    navbarItems: getNavbarItems(translate),
  });
};

export default useNavbarItems;
export type {IUseNavbarItems};
