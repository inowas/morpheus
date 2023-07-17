export interface IMenuItem {
  name: string,
  label: string,
  admin: boolean,
  to: string,
}

export interface IDropdownItem {
  name: string,
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
  subMenu?: ISubMenuItem[];
}

export type INavbarItem = IMenuItem | IDropdownItem;
