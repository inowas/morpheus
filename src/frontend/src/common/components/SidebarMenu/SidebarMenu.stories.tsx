// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';
import {SidebarMenuV1} from '../SidebarMenu';
import menuItems from './MenuItems';

export default {
  title: 'SidebarMenu',
  component: SidebarMenuV1,
} as Meta<typeof SidebarMenuV1>;

export const SidebarMenuExample: StoryFn<typeof SidebarMenuV1> = () => {

  const [listItems, setListItems] = React.useState(menuItems);

  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  return (
    <div style={{position: 'relative', height: '100vh', display: 'block'}}>
      <SidebarMenuV1 menuItems={listItems} handleItemClick={handleItemClick}/>
    </div>
  );


};
