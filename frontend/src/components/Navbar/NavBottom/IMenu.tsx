import MenuItem from './MenuItem';
import styles from './NavBottom.module.less';
import {INavbarItem} from '../types/navbar.type';
import {useNavBottomContext} from './NavBottom';
import React from 'react';

interface IProps {
  navbarItems: INavbarItem[];
  openMobileMenu: boolean;
}

const IMenu = ({navbarItems}: IProps) => {

  const {openMobileMenu} = useNavBottomContext();

  return (
    <nav className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}>
      <ul className={styles.menu}>
        {navbarItems.map((menu: INavbarItem, index: number) => {
          const depthLevel: number = 0;
          return <MenuItem
            items={menu}
            key={index}
            depthLevel={depthLevel}
          />;
        })}
      </ul>
    </nav>
  );
};

export default IMenu;
