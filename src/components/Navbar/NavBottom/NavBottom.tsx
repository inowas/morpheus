import React from 'react';
import {INavbarItem} from '../types/navbar.type';
import IMenu from './IMenu';
import styles from './NavBottom.module.less';
import {Container, Image} from 'semantic-ui-react';


interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const NavBottom = ({navigateTo, navbarItems}: IProps) => {
  console.log(navbarItems);
  // const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  // const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  // const pathname = 1 < location.pathname.length ? location.pathname.slice(1) : 'Home';
  // const [activeItem, setActiveItem] = useState<string>(pathname);
  //
  // const redirectTo = (path: string | undefined) => {
  //   if (path) {
  //     navigateTo(path);
  //     setOpenMobileMenu(!openMobileMenu);
  //   }
  //   if (isMobile) {
  //     setOpenMobileMenu(false);
  //   }
  // };
  //
  // const [isOpen, setIsOpen] = useState(false);
  //
  // const handleOpen = () => {
  //   setIsOpen(true);
  // };
  //
  // const handleClose = () => {
  //   setIsOpen(false);
  // };
  //

  // FIXME = BURGER
  // import React, {useState} from 'react';
  // import useIsMobile from '../hooks/useIsMobile';
  // const [openMobileMenu, setOpenMobileMenu] = useState(false);
  // const {isMobile} = useIsMobile(1199);
  // const handleCloseMobileMenu = () => {
  //   setOpenMobileMenu(!openMobileMenu);
  // };

  return (
    <Container>
      <div className={styles.navBottom}>
        <div className={styles.mainMenuLogo}>
          <Image
            alt="An example alt"
            as="a"
            href="/"
            size="tiny"
            src={'https://inowas.com/wp-content/uploads/2019/11/Logo_INOWAS_2019-1.png'}
            className={styles.logo}
          />
          <p className={styles.description}>Innovative Groundwater Solutions</p>
        </div>
        {/*{isMobile && (*/}
        {/*  <div*/}
        {/*    className={`${styles.menuTrigger} ${openMobileMenu ? styles.menuTrigger__open : ''}`}*/}
        {/*    onClick={handleCloseMobileMenu}*/}
        {/*  >*/}
        {/*    <span></span>*/}
        {/*    <span></span>*/}
        {/*    <span></span>*/}
        {/*  </div>*/}
        {/*)}*/}
        <IMenu navbarItems={navbarItems}/>
      </div>
    </Container>
  );
};

export default NavBottom;
