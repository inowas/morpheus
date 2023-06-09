import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Container, Image, Button } from "semantic-ui-react";
import { IMenuItem, INavbarItem, IDropdownItem } from "./types/navbar.type";
import { useLocation } from "react-router-dom";
// FIXME: create a HOOK : 
import { useMediaQuery } from "react-responsive";

interface IProps {
  headerHeight: number;
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const Navbar = ({ navbarItems, navigateTo, headerHeight = 0 }: IProps) => {

  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const location = useLocation();
  const pathname = location.pathname.length > 1 ? location.pathname.slice(1) : "Home";
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(pathname);

  const isMobile = useMediaQuery({
    query: "(max-width: 1140px)",
  });

  const navbarHeight = isMobile ? `calc(100vh - ${headerHeight}px)` : 'auto';

  const redirectTo = (path: string | undefined) => {
    if (path) {
      navigateTo(path);
      setOpenMobileMenu(!openMobileMenu);
    }
    isMobile && setOpenMobileMenu(false);
  };

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  return (
    <>
      <Container>
        <Menu pointing secondary stackable={true} className="mainMenu">
          <div className="mainMenuLogo">
            <Image
              alt='An example alt'
              as='a'
              href='/'
              size="tiny"
              src={"https://inowas.com/wp-content/uploads/2019/11/Logo_INOWAS_2019-1.png"}
              className="logo"
            />
            <p className="description">Innovative Groundwater Solutions</p>
          </div>
          {isMobile && (
            <div
              className={`menu-trigger ${openMobileMenu ? "menu-trigger--open" : ""}`}
              onClick={handleCloseMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          {/* FIXME: looks strange (need a hook to detect browser resize) */}
          {(isMobile ? openMobileMenu : true ) && <div
            className={`navbar`}
            style={{
              height: navbarHeight,
            }}
            >
            <Container>
                {navbarItems.map((item: INavbarItem) => {
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
                    return (
                      <Dropdown
                        className={item.name === activeItem ? "active" : ""}
                        key={item.name}
                        icon={null}
                        item={true}
                        closeOnChange={true}
                        closeOnBlur={isMobile && false}
                      >
                        <>
                          <Menu.Item
                            name={item.name}
                            className='itemDropdown'
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
                          >
                            {item.subMenu.map((subItem) => (
                              <Dropdown.Item
                                className={subItem.name === activeItem ? "active" : ""}
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
                <Button className="mainMenuButton" onClick={() => {console.log('click')}}> 
                  <span>Sign in!</span>
                </Button>
            </Container>
          </div>}
        </Menu>
      </Container>
    </>
  );
};

export default Navbar;