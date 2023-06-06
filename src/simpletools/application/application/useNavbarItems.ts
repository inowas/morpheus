import { INavbarItem } from "../types/navbar.type";

const navBarItems: INavbarItem[] = [
  {
    name: "Home",
    icon: "tag",
    label: "Home",
    admin: false,
    basepath: "/",
    subMenu: [
      {
        name: "About us",
        label: "About us",
        admin: false,
        to: "/",
      },
      {
        name: "Software releases",
        label: "Software releases",
        admin: false,
        to: "/",
      },
      {
        name: "Publications",
        label: "Publications",
        admin: false,
        to: "/",
      },
      {
        name: "Projects",
        label: "Projects",
        admin: false,
        to: "/Test2",
      },
    ],
  },
  {
    name: "Tools",
    icon: "tag",
    label: "Tools",
    admin: false,
    to: "/",
  },
  {
    name: "Modflow",
    icon: "tag",
    label: "Modflow",
    admin: false,
    to: "/",
  },
  {
    name: "Support",
    icon: "tag",
    label: "Support",
    admin: false,
    to: "/",
  },
  {
    name: "T02",
    icon: "tag",
    label: "T02",
    admin: false,
    to: "/T02",
  },
  {
    name: "News",
    icon: "tag",
    label: "News",
    admin: false,
    to: "/News",
  },

];

interface IUseNavbarItems {
  navbarItems: INavbarItem[];
}

const useNavbarItems = (): IUseNavbarItems => ({
  navbarItems: navBarItems,
});

export default useNavbarItems;
export type { IUseNavbarItems };
