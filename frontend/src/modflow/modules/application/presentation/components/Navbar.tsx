import React from 'react';
import {Menu} from 'semantic-ui-react';

interface IProps {
  location: string;
  navigateTo: (location: string) => void;
}

const Navbar: React.FC<IProps> = ({location, navigateTo}) => (
  <Menu fixed={'bottom'}>
    <Menu.Item
      name='example_1'
      active={location.endsWith('example_1')}
      onClick={() => navigateTo('/example_1')}
    >
      Example 1
    </Menu.Item>

    <Menu.Item
      name='example_2'
      active={location.endsWith('example_2')}
      onClick={() => navigateTo('/example_2')}
    >
      Example 2
    </Menu.Item>

    <Menu.Item
      name='example_3'
      active={location.endsWith('example_3')}
      onClick={() => navigateTo('/example_3')}
    >
      Example 3
    </Menu.Item>

    <Menu.Item
      name='example_4'
      active={location.endsWith('example_4')}
      onClick={() => navigateTo('/example_4')}
    >
      Example 4
    </Menu.Item>
  </Menu>
);

export default Navbar;
