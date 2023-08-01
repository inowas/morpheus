import MenuItem from './MenuItem';
import {IMenuItem} from '../types/navbar.type';
import React from 'react';
import styles from './NavBottom.module.less';

interface ItemProps {
  submenus: IMenuItem[];
  dropdown: boolean;
  depthLevel: number;
  onCloseMobileMenu: () => void;
}

const Dropdown: React.FC<ItemProps> = ({submenus, dropdown, depthLevel, onCloseMobileMenu}) => {
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
          onCloseMobileMenu={onCloseMobileMenu}
        />
      ))}
    </ul>
  );
};

export default Dropdown;
