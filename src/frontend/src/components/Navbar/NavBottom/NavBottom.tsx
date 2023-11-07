import React, {useState} from 'react';
import {INavbarItem} from '../types/navbar.type';
import logoInowas from '../images/logo-inowas.png';
import useIsMobile from '../hooks/useIsMobile';
import styles from './NavBottom.module.less';
import {Image, Input} from 'semantic-ui-react';
import MenuItem from './MenuItem';
import Wrapper from '../../Wrapper/Wrapper';
import {Button} from '../../index';

interface IProps {
  navbarItems: INavbarItem[];
  pathname: string;
  navigateTo: (path: string) => void;
}

const NavBottom: React.FC<IProps> = ({navbarItems, pathname, navigateTo}) => {
  const {isMobile} = useIsMobile(1199);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu((prevState) => !prevState);
  };

  return (
    <div className={styles.navBottom}>
      <Wrapper>
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
          {isMobile ? (
            <div
              className={`${styles.menuTrigger} ${openMobileMenu ? styles.menuTrigger__open : ''}`}
              onClick={handleCloseMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div className={styles.searchWrapper}>
              <Input
                action={true}
                actionPosition="left"
                className={`${styles.search}`}
              >
                <Button primary={true}>Search</Button>
                <input/>
              </Input>
            </div>
          )}
          <nav className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}>
            <div className={styles.navWrapper}>
              {isMobile && <div className={styles.searchWrapper}>
                <Input
                  action={true}
                  actionPosition="left"
                  className={`${styles.search}`}
                >
                  <Button primary={true}>Search</Button>
                  <input/>
                </Input>
              </div>}
              <ul className={styles.menu}>
                {navbarItems.map((item: INavbarItem, idx: number) => {
                  return <MenuItem
                    key={idx}
                    items={item}
                    onCloseMobileMenu={handleCloseMobileMenu}
                    pathname={pathname}
                    navigateTo={navigateTo}
                  />;
                })}
              </ul>
              <Button className={styles.createButton} primary={true}>Create new model</Button>
            </div>
          </nav>
        </div>
      </Wrapper>
    </div>
  );
};

export default NavBottom;
