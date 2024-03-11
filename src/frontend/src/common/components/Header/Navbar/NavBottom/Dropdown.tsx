import {IMenuItem} from '../types/navbar.type';
import MenuItem from './MenuItem';
import React from 'react';
import styles from './NavBottom.module.less';

interface ItemProps {
  submenus: IMenuItem[];
  dropdown: boolean;
  depthLevel: number;
  onCloseMobileMenu: () => void;
  pathname: string;
  navigateTo: (path: string) => void;
}

const Dropdown: React.FC<ItemProps> = ({submenus, dropdown, depthLevel, onCloseMobileMenu, pathname, navigateTo}) => {
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
          pathname={pathname}
          navigateTo={navigateTo}
        />
      ))}
    </ul>
  );
};

export default Dropdown;
