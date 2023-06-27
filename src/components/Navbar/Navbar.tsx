import React, {useState} from 'react';
import {Container, Dropdown, Image, Menu} from 'semantic-ui-react';
import {IDropdownItem, IMenuItem, INavbarItem} from './types/navbar.type';
import {Link, useLocation} from 'react-router-dom';
import styles from './Navbar.module.less';
import useIsMobile from 'simpletools/common/hooks/useIsMobile';
import logoTUDresden from './images/logo-tud.svg';
import LanguageSelector from '../LanguageSelector/LanguageSelector';


interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const Navbar = ({navbarItems, navigateTo}: IProps) => {

  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const location = useLocation();
  const pathname = 1 < location.pathname.length ? location.pathname.slice(1) : 'Home';
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(pathname);

  const {isMobile} = useIsMobile();

  const redirectTo = (path: string | undefined) => {
    if (path) {
      navigateTo(path);
      setOpenMobileMenu(!openMobileMenu);
    }
    if (isMobile) {
      setOpenMobileMenu(false);
    }
  };

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Container className={styles.containerTop}>
          <div className={styles.inner}>
            <Link to="/" className={styles.logo}>
              <img
                className={styles.logo}
                src={logoTUDresden}
                alt={'logo'}
              />
            </Link>
            <Menu
              className={styles.menu}
              secondary={true}
              position="right"
            >
              <Menu.Item
                name="Contact"
                as="a"
                className={styles.item}
                // active={activeItem === 'logout'}
                // onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Legal Notice"
                as="a"
                className={styles.item}
                // active={activeItem === 'logout'}
                // onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Accessibility"
                as="a"
                className={styles.item}
                // active={activeItem === 'logout'}
                // onClick={this.handleItemClick}
              />
              <Menu.Item
                primary={true}
                name="Sign in!"
                as="a"
                className={`${styles.item} ${styles.itemLogIn}`}
                // active={activeItem === 'logout'}
                // onClick={this.handleItemClick}
              />
              <LanguageSelector/>
            </Menu>
          </div>
        </Container>
      </div>
      <div className={styles.wrapperNavigation}>
        <Container>
          <Menu
            pointing={true}
            secondary={true}
            className="mainMenu"
          >
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
            {(isMobile ? openMobileMenu : true) && <div
              className="navbar"
            >
              <Container>
                {navbarItems.map((item: INavbarItem, index: number) => {
                  if (isMenuItem(item)) {
                    return (
                      <Menu.Item
                        key={item.name}
                        name={item.name}
                        active={item.name === activeItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          redirectTo(item.to);
                          setActiveItem(item.name);
                        }}
                      >
                        <span className="text">{item.label}</span>
                      </Menu.Item>
                    );
                  }
                  if (isDropdownItem(item)) {
                    const isLastTwo: boolean = index >= navbarItems.length - 2;
                    const style = isLastTwo
                      ? {right: 0, left: 'auto'}
                      : {};
                    return (
                      <Dropdown
                        className={item.name === activeItem ? 'active' : ''}
                        key={item.name}
                        icon={null}
                        item={true}
                        closeOnChange={true}
                        closeOnBlur={isMobile && false}
                      >
                        <>
                          <Menu.Item
                            name={item.name}
                            className="itemDropdown"
                            active={item.name === activeItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              redirectTo(item.basepath);
                              setActiveItem(item.name);
                            }}
                          >
                            <span className="text">{item.label}</span>
                          </Menu.Item>
                          {isMobile && <button aria-label="Togle menu" className="btnDropdown">
                            <span aria-hidden="true" className="icon"></span>
                          </button>}
                          <Dropdown.Menu
                            className="dropdownMenu"
                            style={style}
                          >
                            {item.subMenu.map((subItem) => (
                              <Dropdown.Item
                                className={subItem.name === activeItem ? 'active' : ''}
                                key={subItem.name}
                                icon={null}
                                text={subItem.label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  redirectTo(subItem.to);
                                  setActiveItem(subItem.name);
                                }}
                              />
                            ))}
                          </Dropdown.Menu>
                        </>
                      </Dropdown>
                    );
                  }
                  return null;
                })}
              </Container>
            </div>}
          </Menu>
        </Container>
      </div>
    </>
  );
};

export default Navbar;
