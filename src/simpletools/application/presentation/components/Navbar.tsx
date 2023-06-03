import React, {useState} from 'react';
import {Menu, MenuItemProps} from 'semantic-ui-react';
import {IMenuItem, INavbarItem} from '../../types/navbar.type';

interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const isMenuItem = (item: any): item is IMenuItem => item.to !== undefined && item.icon !== undefined;

const Navbar = ({navbarItems, navigateTo}: IProps) => {

  const [activeItem, setActiveItem] = useState<string>('home');
  const handleItemClick = (event: any, data: MenuItemProps) => setActiveItem(data.name as string);

  return (
    <Menu inverted={true}>
      {navbarItems.map((item: INavbarItem) => {
        if (isMenuItem(item)) {
          return (
            <Menu.Item
              key={item.name}
              name={item.name}
              active={item.name === activeItem}
              onClick={() => {
                navigateTo(item.to);
                handleItemClick(null, {name: item.name});
              }}
            />
          );
        }
      })}
    </Menu>
  );
};

export default Navbar;
