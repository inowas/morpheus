import {Button, ContentWrapper} from 'common/components';
import {Image, Input} from 'semantic-ui-react';
import React, {useState} from 'react';

import {INavbarItem} from './types/navbar.type';
import MenuItem from './MenuItem';
import logoInowas from './images/logo-inowas.png';
import styles from './Navbar.module.less';
import useIsMobile from 'common/hooks/useIsMobile';

interface IProps {
  navbarItems: INavbarItem[];
  location: any;
  navigateTo: (path: string) => void;
  search?: {
    value: string;
    onChange: (value: string) => void;
  };
  button?: React.ReactNode;
}

const Navbar: React.FC<IProps> = ({
  navbarItems,
  location,
  navigateTo,
  search,
  button,
}) => {
  const {isMobile} = useIsMobile();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu((prevState) => !prevState);
  };

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
                alt="An example alt"
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
                onClick={handleCloseMobileMenu}
                data-testid={'menu-trigger'}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            {(search && !isMobile) && (
              <div className={styles.searchWrapper}>
                <Input
                  action={true}
                  actionPosition="left"
                  className={`${styles.search}`}
                  value={search.value}
                  onChange={(e) => search.onChange(e.target.value)}
                >
                  <Button primary={true}>Search</Button>
                  <input/>
                </Input>
              </div>
            )}
            <nav
              data-testid={'test-nav'}
              className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}
            >
              <div className={styles.navWrapper}>
                <ul className={styles.menu}>
                  {navbarItems.map((item: INavbarItem, idx: number) => {
                    return <MenuItem
                      key={idx}
                      items={item}
                      onCloseMobileMenu={handleCloseMobileMenu}
                      location={location}
                      navigateTo={navigateTo}
                    />;
                  })}
                </ul>
                {button}
              </div>
              {(search && isMobile) && (
                <div className={styles.searchWrapper}>
                  <Input
                    action={true}
                    actionPosition="left"
                    className={`${styles.search}`}
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                  >
                    <Button primary={true}>Search</Button>
                    <input/>
                  </Input>
                </div>
              )}
            </nav>
          </div>
        </ContentWrapper>
      </div>
    </>
  );
};

export default Navbar;
export type {INavbarItem};
