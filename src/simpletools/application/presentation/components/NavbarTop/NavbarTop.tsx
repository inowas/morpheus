import React from "react";
import Logo from '../images/logo';
import {Container, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styles from './NavbarTop.module.less'

interface IProps {
  navigateTo: (path: string) => void;
}

const NavbarTop = ({navigateTo}: IProps) => {  
  return (
      <div className={styles.wrapper}>
        <Container className={styles.container}>
          <div className={styles.inner}>
            <Link to="/" className={styles.logo}>
              <Logo/>
            </Link>
            <Menu className={styles.menu} secondary position='right'>
                <Menu.Item
                  name='Contact'
                  as='a'
                  className={styles.item}
                  // active={activeItem === 'logout'}
                  // onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Legal Notice'
                  as='a'
                  className={styles.item}
                  // active={activeItem === 'logout'}
                  // onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='Accessibility'
                  as='a'
                  className={styles.item}
                  // active={activeItem === 'logout'}
                  // onClick={this.handleItemClick}
                />
            </Menu>
          </div>
        </Container>
      </div>
  );
};

export default NavbarTop;


