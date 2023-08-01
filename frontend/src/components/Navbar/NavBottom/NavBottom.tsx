import React, {useState} from 'react';
import {INavbarItem} from '../types/navbar.type';
import logoInowas from '../images/logo-inowas.png';
import useIsMobile from '../hooks/useIsMobile';
import styles from './NavBottom.module.less';
import {Container, Image} from 'semantic-ui-react';
import MenuItem from './MenuItem';

interface IProps {
  navbarItems: INavbarItem[];
}

const NavBottom: React.FC<IProps> = ({navbarItems}) => {
  const {isMobile} = useIsMobile(1199);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu((prevState) => !prevState);
  };

  return (
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
        <nav className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}>
          <ul className={styles.menu}>
            {navbarItems.map((item: INavbarItem, idx: number) => {
              return <MenuItem
                items={item}
                key={idx}
                onCloseMobileMenu={handleCloseMobileMenu}
              />;
            })}
          </ul>
        </nav>
      </div>
    </Container>
  );
};

export default NavBottom;
