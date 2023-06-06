import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Container, Image, Button } from "semantic-ui-react";
import { IMenuItem, INavbarItem, IDropdownItem } from "../../types/navbar.type";
import {  useLocation } from 'react-router-dom';

// import styles from './Navbar.module.less'

interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const Navbar = ({ navbarItems, navigateTo }: IProps) => {
  // const isMenuItem = (item: any): item is IMenuItem => item.to !== undefined && item.icon !== undefined;

  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const location = useLocation()
  const pathname = location.pathname.length > 1 ? location.pathname.slice(1) : 'Home';
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(pathname);
  
  const handleCloseMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  return (
    <Container>
      <Menu
        pointing secondary
        stackable={true}
        className="mainMenu"
      >
        <Image
          // alt='An example alt'
          size="tiny"
          src={'https://inowas.com/wp-content/uploads/2019/11/Logo_INOWAS_2019-1.png'}
          className="mainMenuLogo"

        />
        <div className={`bt-menu-trigger ${openMobileMenu ? 'bt-menu-open' : ''}`} onClick={handleCloseMobileMenu}>
          <span/>
        </div>
        <div
          className={openMobileMenu ? 'container' : 'container close'}
          style={{
            width: 'auto',
          }}
          // style={{
          //   width: '100%',
          //   marginLeft: 0,
          //   marginRight: 0,
          //   transition: 'transform 500ms linear',
          // }}
        >
          {navbarItems.map((item: INavbarItem) => {
            if (isMenuItem(item)) {
              return (
                <Menu.Item
                  key={item.name}
                  name={item.name}
                  as="a"
                  active={item.name === activeItem}
                  onClick={() => {
                    setActiveItem(item.name);
                    navigateTo(item.to);
                  }}
                >
                  <span className="text">
                    {item.label}
                  </span>
                </Menu.Item>
              );
            }
            if (isDropdownItem(item)) {
              return (
                <Dropdown
                    key={item.name}
                    // FIXME: remove mainMenuDropdown class
                    className={item.name === activeItem ?  'active mainMenuDropdown' : 'mainMenuDropdown'}
                    icon={null}
                    item={true}
                    text={item.label}
                    // active={item.name === activeItem}
                    onClick={() => {
                      setActiveItem(item.name);
                      navigateTo(item.basepath);
                    }}
                  >
                    <Dropdown.Menu
                      className="subMenu"
                      // style={{backgroundColor: '#003043'}}
                    >
                      {item.subMenu.map((subItem) => (
                        <Dropdown.Item
                          className={subItem.name === activeItem ?  'active' : ''}
                          key={subItem.name}
                          icon={null}
                          text={subItem.label}
                          // active={subItem.name === activeItem}
                          as="a"
                          onClick={() => {
                            console.log(activeItem);
                            setActiveItem(subItem.name);
                            console.log(subItem.name);
                            navigateTo(subItem.to);
                          }}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
              );
            }
            return null;
          })}
          <Button className='mainMenuButton'>
            <span>
            Sign in!
            </span>
          </Button>

        </div>
      </Menu>

    </Container>
    // <Menu pointing secondary className="mainMenu">
    //   <Image
    //     size="tiny"
    //     src={'https://inowas.com/wp-content/uploads/2019/11/Logo_INOWAS_2019-1.png'}
    //     className="mainMenuLogo"
    //   />
    //   <Container
    //     className={openMobileMenu ? '' : 'close'}
    //     style={{
    //       width: 'auto',
    //     }}
    //   >
    //     {navbarItems.map((item: INavbarItem) => {
    //       if (isMenuItem(item)) {
    //         return (
    //           <Menu.Item
    //             key={item.name}
    //             name={item.name}
    //             active={item.name === activeItem}
    //             onClick={() => {
    //               setActiveItem(item.name);
    //               navigateTo(item.to);
    //             }}
    //           />
    //         );
    //       }
    //       if (isDropdownItem(item)) {
    //         return (
    //           <Menu.Item
    //             as="div"
    //             key={item.name}
    //             name={item.name}
    //             active={item.name === activeItem}
    //             onClick={() => {
    //               setActiveItem(item.name);
    //             }}
    //           >
    //             {item.name}
    //             <Menu vertical className="mainSubMenu">
    //               {item.subMenu.map((item) => {
    //                 return (
    //                   <Menu.Item
    //                     key={item.name}
    //                     name={item.name}
    //                     active={item.name === activeItem}
    //                     onClick={() => {
    //                       setActiveItem(item.name);
    //                       navigateTo(item.to);
    //                     }}
    //                   />
    //                 );
    //               })}
    //             </Menu>
    //           </Menu.Item>
    //         );
    //       }
    //     })}
    //   </Container>
    // </Menu>
  );
};

export default Navbar;
