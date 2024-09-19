import {Image} from 'semantic-ui-react';
import React, {useState} from 'react';

import {INavbarItem} from './types/navbar.type';
import MenuItem from './MenuItem';
import logoInowas from './images/logo-inowas.png';
import styles from './Navbar.module.less';
import useIsMobile from 'common/hooks/useIsMobile';
import ContentWrapper from '../ContentWrapper/ContentWrapper';

interface IProps {
  navbarItems: INavbarItem[];
  location: any;
  navigateTo: (path: string) => void;
  button?: React.ReactNode;
  children?: React.ReactNode;
}

const Navbar: React.FC<IProps> = ({
  navbarItems,
  location,
  navigateTo,
  button,
  children,
}) => {
  const {isMobile} = useIsMobile();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <>
      {/* Navbar */}
      <div
        className={styles.navbar}
        data-testid={'test-navbar'}
      >
        <ContentWrapper>
          <div className={styles.inner}>
            <div className={styles.mainMenuLogo}>
              <Image
                alt="inowas logo"
                as="a"
                href="/"
                size="tiny"
                src={logoInowas}
                className={styles.logo}
              />
              <p className={styles.description}>Innovative Groundwater Solutions</p>
            </div>
            {isMobile && (
              <div
                className={`${styles.menuTrigger} ${openMobileMenu ? styles.menuTrigger__open : ''}`}
                onClick={() => setOpenMobileMenu((prevState) => !prevState)}
                data-testid={'menu-trigger'}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            {(children && !isMobile) && (
              <div className={styles.contentWrapper}>
                {children}
              </div>
            )}
            <nav
              data-testid={'test-nav'}
              className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}
            >
              <div className={styles.navWrapper}>
                {isMobile && children}
                <ul className={styles.menu}>
                  {navbarItems.map((item: INavbarItem, idx: number) => (
                    <MenuItem
                      key={idx}
                      items={item}
                      onCloseMobileMenu={() => setOpenMobileMenu(false)}
                      location={location}
                      navigateTo={navigateTo}
                    />
                  ))}
                </ul>
                {button}
              </div>
            </nav>
          </div>
        </ContentWrapper>
      </div>
    </>
  );
};

export default Navbar;
export type {INavbarItem};
