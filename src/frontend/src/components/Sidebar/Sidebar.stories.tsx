import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Sidebar from '../Sidebar';
import menuItems from '../SidebarMenu/MenuItems';

export default {
  title: 'Sidebar',
  component: Sidebar,
} as Meta<typeof Sidebar>;

export const SidebarExample: StoryFn<typeof Sidebar> = () => (
  <Sidebar
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </Sidebar>
);

export const SidebarSmallSizeExample: StoryFn<typeof Sidebar> = () => (
  <Sidebar
    headerHeight={0}
    open={true}
    maxWidth={350}
    contentFullWidth={false}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </Sidebar>
);

export const SidebarWithSidebarMenuExample: StoryFn<typeof Sidebar> = () => {
  const [listItems, setListItems] = React.useState(menuItems);
  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  return <Sidebar
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
    menuItems={listItems}
    handleItemClick={handleItemClick}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </Sidebar>;
};
