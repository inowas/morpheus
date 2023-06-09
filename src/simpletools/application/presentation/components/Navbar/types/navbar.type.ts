import {SemanticIcons} from 'components/types/SemanticIcons.type';

export interface IMenuItem {
  name: string,
  icon: SemanticIcons,
  label: string,
  admin: boolean,
  to: string,
}

export interface IDropdownItem {
  name: string,
  icon: SemanticIcons,
  label: string,
  admin: boolean,
  basepath: string,
  subMenu: ISubMenuItem[];
}

interface ISubMenuItem {
  name: string,
  label: string,
  admin: boolean,
  to: string,
}

export type INavbarItem = IMenuItem | IDropdownItem;
