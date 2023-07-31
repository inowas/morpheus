import MenuItem from './MenuItem';
import {IMenuItem} from '../types/navbar.type';
import React from 'react';
import styles from './NavBottom.module.less';

interface ItemProps {
  submenus: IMenuItem[];
  dropdown: boolean;
  depthLevel: number;
  handleCloseMobileMenu: () => void;
}

const Dropdown: React.FC<ItemProps> = ({submenus, dropdown, depthLevel, handleCloseMobileMenu}) => {
  depthLevel = depthLevel + 1;

  return (
    <ul
      className={`${styles.dropdown} ${dropdown ? styles.show : ''}`}
    >
      {submenus.map((submenuitem: IMenuItem, idx: number) => (
        <MenuItem
          items={submenuitem}
          key={idx}
          depthLevel={depthLevel}
          handleCloseMobileMenu={handleCloseMobileMenu}
        />
      ))}
    </ul>
  );
};

export default Dropdown;
