import {INavbarItem} from 'components/Navbar/types/navbar.type';

const navBarItems: INavbarItem[] = [
  {
    name: 'Home',
    label: 'Home',
    admin: false,
    basepath: '/1',
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
    ],
  },
  {
    name: 'Tools',
    label: 'Tools',
    admin: false,
    basepath: '/',
    subMenu: [
      {
        name: 'T02',
        label: 'T02: Groundwater mounding (Hantush)',
        admin: false,
        to: '/T02',
      },
      {
        name: 'T04',
        label: 'T04: Database for GIS Based Site Suitability Mapping',
        admin: false,
        to: '/T04',
      },
      {
        name: 'T05',
        label: 'T05: GIS multi-criteria decision analysis',
        admin: false,
        to: '/T05',
      },
      {
        name: 'T06',
        label: 'T06: MAR method selection',
        admin: false,
        to: '/T06',
      },
      {
        name: 'T08',
        label: 'T08: 1D transport equation (Ogata-Banks)',
        admin: false,
        to: '/T08',
      },
      {
        name: 'T09',
        label: 'T09: Simple saltwater intrusion equations',
        admin: false,
        to: '/T09',
      },
      {
        name: 'T11',
        label: 'T11: MAR model selection',
        admin: false,
        to: '/T11',
      },
      {
        name: 'T13',
        label: 'T13: Travel time through unconfined aquifer',
        admin: false,
        to: '/T13',
      },
      {
        name: 'T14',
        label: 'T14: Pumping-induced river drawdown',
        admin: false,
        to: '/T14',
      },
      {
        name: 'T15',
        label: 'T15: Quantitative microbial risk assessment',
        admin: false,
        to: '/T15',
      },
      {
        name: 'T18',
        label: 'T18: SAT basin design',
        admin: false,
        to: '/T18',
      },
      {
        name: 'T19',
        label: 'T19: Heat transport',
        admin: false,
        to: '/T19',
      },
    ],
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
