import React, {createContext, useContext, useState} from 'react';
import {INavbarItem} from '../types/navbar.type';
import logoInowas from '../images/logo-inowas.png';
import useIsMobile from '../hooks/useIsMobile';
import IMenu from './IMenu';
import styles from './NavBottom.module.less';
import {Container, Image} from 'semantic-ui-react';

interface IProps {
  navbarItems: INavbarItem[];
}

interface NavBottomContextValue {
  openMobileMenu: boolean;
  handleCloseMobileMenu: () => void;
}

const NavBottomContext = createContext<NavBottomContextValue | undefined>(undefined);

const NavBottom: React.FC<IProps> = ({navbarItems}) => {
  const {isMobile} = useIsMobile(1199);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu((prevState) => !prevState);
  };

  return (
    <NavBottomContext.Provider value={{openMobileMenu, handleCloseMobileMenu}}>
      <Container>
        <div className={styles.navBottom}>
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
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <IMenu
            navbarItems={navbarItems}
            openMobileMenu={openMobileMenu}
          />
        </div>
      </Container>
    </NavBottomContext.Provider>
  );
};

const useNavBottomContext = (): NavBottomContextValue => {
  const context = useContext(NavBottomContext);
  if (!context) {
    throw new Error('useNavBottomContext must be used within a NavBottom');
  }
  return context;
};

export {NavBottom, useNavBottomContext};
