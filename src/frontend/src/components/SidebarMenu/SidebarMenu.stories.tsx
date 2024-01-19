import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {SidebarMenu} from '../SidebarMenu';
import menuItems from './MenuItems';

export default {
  title: 'SidebarMenu',
  component: SidebarMenu,
} as Meta<typeof SidebarMenu>;

export const SidebarMenuExample: StoryFn<typeof SidebarMenu> = () => {

  const [listItems, setListItems] = React.useState(menuItems);

  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  return (
    <div style={{position: 'relative', height: '100vh', display: 'block'}}>
      <SidebarMenu menuItems={listItems} handleItemClick={handleItemClick}/>
    </div>
  );


};
