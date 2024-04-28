export interface IMenuItem {
  name: string,
  label: string,
  admin: boolean,
  to: string,
  disabled?: boolean,
}

export interface IDropdownItem {
  name: string,
  label: string,
  admin: boolean,
  basepath: string,
  subMenu: ISubMenuItem[];
  disabled?: boolean;
}

interface ISubMenuItem {
  name: string,
  label: string,
  admin: boolean,
  to: string,
  disabled?: boolean,
}

export type INavbarItem = IMenuItem | IDropdownItem;
