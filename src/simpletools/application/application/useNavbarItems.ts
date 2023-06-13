import {INavbarItem} from '../presentation/components/Navbar/types/navbar.type';

const navBarItems: INavbarItem[] = [
  {
    name: 'Home',
    label: 'Home',
    admin: false,
    basepath: '/',
    subMenu: [
      {
        name: 'About us',
        label: 'About us',
        admin: false,
        to: '/1',
      },
      {
        name: 'Software releases',
        label: 'Software releases',
        admin: false,
        to: '/2',
      },
      {
        name: 'Publications',
        label: 'Publications',
        admin: false,
        to: '/3',
      },
      {
        name: 'Projects',
        label: 'Projects',
        admin: false,
        to: '/4',
      },
      {
        name: 'Home',
        label: 'Home',
        admin: false,
        to: '/',
      },
      {
        name: 'T02',
        label: 'T02',
        admin: false,
        to: '/T02',
      },
    ],
  },
  {
    name: 'Tools',
    label: 'Tools',
    admin: false,
    to: '/',
  },
  {
    name: 'Modflow',
    label: 'Modflow',
    admin: false,
    to: '/',
  },
  {
    name: 'Support',
    label: 'Support',
    admin: false,
    to: '/',
  },
  {
    name: 'T02',
    label: 'T02',
    admin: false,
    to: '/T02',
  },
  {
    name: 'News',
    label: 'News',
    admin: false,
    to: '/news',
  },

];

interface IUseNavbarItems {
  navbarItems: INavbarItem[];
}

const useNavbarItems = (): IUseNavbarItems => ({
  navbarItems: navBarItems,
});

export default useNavbarItems;
export type {IUseNavbarItems};
