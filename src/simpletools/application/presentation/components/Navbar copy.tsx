import React, { useState } from "react";
import { Menu, Dropdown, Container, Image, Button } from "semantic-ui-react";
import { IMenuItem, INavbarItem, IDropdownItem } from "../../types/navbar.type";
// import styles from './Navbar.module.less'

interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const Navbar = ({ navbarItems, navigateTo }: IProps) => {
  // const isMenuItem = (item: any): item is IMenuItem => item.to !== undefined && item.icon !== undefined;

  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("home");
  const handleCloseMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  return (
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
    <>
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
        <Container
          className={openMobileMenu ? '' : 'close'}
          style={{
            width: 'auto',
          }}
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
                />
              );
            }

            if (isDropdownItem(item)) {
              return (
                <>
                  <Dropdown
                    className="mainMenuDropdown"
                    key={item.name}
                    icon={null}
                    item={true}
                    text={item.label}
                    onClick={() => {
                      setActiveItem(item.name);
                      navigateTo(item.basepath);
                    }}
                  >
                    <Dropdown.Menu>
                      {item.subMenu.map((subItem) => (
                        <Dropdown.Item
                          key={subItem.name}
                          icon={null}
                          item={true}
                          text={subItem.label}
                          as="a"
                          onClick={() => {
                            setActiveItem(subItem.name);
                            navigateTo(subItem.to);
                          }}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              );
            }
            return null;
          })}
          <Button className='mainMenuButton'>
            Sign in!
          </Button>

        </Container>
      </Menu>

    </>
  );
};

export default Navbar;
