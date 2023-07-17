import React, {useState} from 'react';
import {IDropdownItem, IMenuItem, INavbarItem} from '../types/navbar.type';
import useIsMobile from '../hooks/useIsMobile';

interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const NavBottom = ({navigateTo, navbarItems}: IProps) => {
  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const {isMobile} = useIsMobile(1199);
  const pathname = 1 < location.pathname.length ? location.pathname.slice(1) : 'Home';
  const [activeItem, setActiveItem] = useState<string>(pathname);

  const redirectTo = (path: string | undefined) => {
    if (path) {
      navigateTo(path);
      setOpenMobileMenu(!openMobileMenu);
    }
    if (isMobile) {
      setOpenMobileMenu(false);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };
  return (
    <>

      // FIXME v2
      {/*<Container>*/}
      {/*  <nav*/}
      {/*    className={styles.nav}*/}
      {/*  >*/}
      {/*    <div className={styles.mainMenuLogo}>*/}
      {/*      <Image*/}
      {/*        alt="An example alt"*/}
      {/*        as="a"*/}
      {/*        href="/"*/}
      {/*        size="tiny"*/}
      {/*        src={'https://inowas.com/wp-content/uploads/2019/11/Logo_INOWAS_2019-1.png'}*/}
      {/*        className={styles.logo}*/}
      {/*      />*/}
      {/*      <p className={styles.description}>Innovative Groundwater Solutions</p>*/}
      {/*    </div>*/}
      {/*    {isMobile && (*/}
      {/*      <div*/}
      {/*        className={`${styles.menuTrigger} ${openMobileMenu ? styles.menuTrigger__open : ''}`}*/}
      {/*        onClick={handleCloseMobileMenu}*/}
      {/*      >*/}
      {/*        <span></span>*/}
      {/*        <span></span>*/}
      {/*        <span></span>*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*    <ul className={styles.navList}>*/}
      {/*      {navbarItems.map((item: INavbarItem, index: number) => {*/}
      {/*        if (isMenuItem(item)) {*/}
      {/*          return (*/}
      {/*            <li*/}
      {/*              key={item.name}*/}
      {/*              className={styles.navItem}*/}
      {/*            >*/}
      {/*              <Menu.Item*/}
      {/*                className={styles.navLink}*/}
      {/*                name={item.name}*/}
      {/*                active={item.name === activeItem}*/}
      {/*                onClick={(e) => {*/}
      {/*                  e.stopPropagation();*/}
      {/*                  redirectTo(item.to);*/}
      {/*                  setActiveItem(item.name);*/}
      {/*                }}*/}
      {/*              />*/}
      {/*            </li>*/}
      {/*          );*/}
      {/*        }*/}
      {/*        if (isDropdownItem(item)) {*/}
      {/*          // const isLastTwo: boolean = index >= navbarItems.length - 2;*/}
      {/*          // const style = isLastTwo*/}
      {/*          //   ? {right: 0, left: 'auto'}*/}
      {/*          //   : {};*/}
      {/*          return (*/}
      {/*            <li*/}
      {/*              key={item.name}*/}
      {/*              className={styles.navItem}*/}
      {/*            >*/}
      {/*              <Menu.Item*/}
      {/*                className={styles.navLink}*/}
      {/*                name={item.name}*/}
      {/*                active={item.name === activeItem}*/}
      {/*                onClick={(e) => {*/}
      {/*                  e.stopPropagation();*/}
      {/*                  redirectTo(item.basepath);*/}
      {/*                  setActiveItem(item.name);*/}
      {/*                }}*/}
      {/*              >*/}
      {/*              </Menu.Item>*/}
      {/*              {isMobile && <button aria-label="Togle menu" className="btnDropdown">*/}
      {/*                <span aria-hidden="true" className="icon"></span>*/}
      {/*              </button>}*/}
      {/*              <ul className={styles.navListDropdown}>*/}
      {/*                {item.subMenu.map((subItem) => (*/}
      {/*                  <li*/}
      {/*                    key={subItem.name}*/}
      {/*                    className={styles.navItemDropdown}*/}
      {/*                  >*/}
      {/*                    <Menu.Item*/}
      {/*                      name={subItem.label}*/}
      {/*                      className={styles.navLinkDropdown}*/}
      {/*                      // className={subItem.name === activeItem ? 'active' : ''}*/}
      {/*                      // text={subItem.label}*/}
      {/*                      onClick={(e) => {*/}
      {/*                        e.stopPropagation();*/}
      {/*                        redirectTo(subItem.to);*/}
      {/*                        setActiveItem(subItem.name);*/}
      {/*                      }}*/}
      {/*                    />*/}
      {/*                  </li>*/}
      {/*                ))}*/}
      {/*              </ul>*/}
      {/*            </li>*/}
      {/*          );*/}
      {/*        }*/}
      {/*        return null;*/}
      {/*      })}*/}
      {/*    </ul>*/}

      {/*  </nav>*/}
      {/*</Container>*/}

      // FIXME v1
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
    </>
  );
};

export default NavBottom;
