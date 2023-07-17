import MenuItem from './MenuItem';
import styles from './NavBottom.module.less';
import {INavbarItem} from '../types/navbar.type';
import React from 'react';

interface IProps {
  navbarItems: INavbarItem[];
}

const IMenu = ({navbarItems}: IProps) => {
  return (
    <nav>
      <ul className={styles.menu}>
        {navbarItems.map((menu: INavbarItem, index: number) => {
          return <MenuItem items={menu} key={index}/>;
        })}
      </ul>
    </nav>
  );
};

export default IMenu;
