import MenuItem from './MenuItem';
import {IMenuItem} from '../types/navbar.type';
import React from 'react';
import styles from './NavBottom.module.less';

interface ItemProps {
  submenus: IMenuItem[];
  dropdown: boolean;
}

const Dropdown: React.FC<ItemProps> = ({submenus, dropdown}) => {

  return (
    <ul
      className={`${styles.dropdown} ${dropdown ? styles.show : ''}`}
    >
      {submenus.map((submenu: IMenuItem, index: number) => (
        <MenuItem
          items={submenu}
          key={index}
          // depthLevel={depthLevel}
        />
      ))}
    </ul>
  );
};

export default Dropdown;
