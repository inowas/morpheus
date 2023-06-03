import {INavbarItem} from '../types/navbar.type';

const navBarItems: INavbarItem[] = [
  {
    name: 'Home',
    icon: 'tag',
    label: 'Home',
    admin: false,
    to: '/',
  },
  {
    name: 'T02',
    icon: 'tag',
    label: 'T02',
    admin: false,
    to: '/T02',
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
