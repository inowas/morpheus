import {IMenuItem} from './types/navbar.type';
import MenuItem from './MenuItem';
import React from 'react';
import styles from './Navbar.module.less';

interface ItemProps {
  submenus: IMenuItem[];
  dropdown: boolean;
  depthLevel: number;
  onCloseMobileMenu: () => void;
  location: any;
  navigateTo: (path: string) => void;
}

const MenuDropdown: React.FC<ItemProps> = ({submenus, dropdown, depthLevel, onCloseMobileMenu, location, navigateTo}) => {
  depthLevel = depthLevel + 1;

  return (
    <ul
      className={`${styles.dropdown} ${dropdown ? styles.show : ''}`}
    >
      {submenus.map((submenuitem: IMenuItem, idx: number) => (
        <MenuItem
          key={idx}
          items={submenuitem}
          depthLevel={depthLevel}
          onCloseMobileMenu={onCloseMobileMenu}
          location={location}
          navigateTo={navigateTo}
        />
      ))}
    </ul>
  );
};

export default MenuDropdown;
