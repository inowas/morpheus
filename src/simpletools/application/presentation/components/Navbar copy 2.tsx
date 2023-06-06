import React, { useState } from "react";
import { Menu, Dropdown, Container, Image, Button, Icon} from "semantic-ui-react";
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

  const isActive = (item: boolean) => {
    if (item) {
      return item;
    }
    return false;
  };


  return (
    <>
      <Menu
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
            width: '100%',
            marginLeft: 0,
            marginRight: 0,
            transition: 'transform 500ms linear',
          }}
        >
          {navbarItems.map((item: INavbarItem) => {
            if (isMenuItem(item)) {
              return (
                <Menu.Item
                  key={item.name}
                  name={item.name}
                  as="a"
                  style={{fontFamily: 'Oswald', fontSize: '16px', padding: '8px 15px', textTransform: 'uppercase'}}
                  active={item.name === activeItem}
                  onClick={() => {
                    setActiveItem(item.name);
                    navigateTo(item.to);
                  }}
                >
                  {/* <Icon name={item.icon}/>
                  {item.label} */}
                </Menu.Item>
              );
            }

            if (isDropdownItem(item)) {
              return (
                <>
                  <Dropdown
                    className="mainMenuDropdown"
                    key={item.name}
                    icon={item.icon}
                    item={true}
                    text={item.label}
                    onClick={() => {
                      setActiveItem(item.name);
                      navigateTo(item.basepath);
                    }}
                    
                  >
                    <Dropdown.Menu style={{backgroundColor: '#003043'}}>
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
