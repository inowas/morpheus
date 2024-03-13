// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React from 'react';
import {ApplicationContentWrapper} from 'common/components';
import menuItems from 'common/components/SidebarMenu/MenuItems';

export default {
  title: 'ApplicationContentWrapper',
  component: ApplicationContentWrapper,
} as Meta<typeof ApplicationContentWrapper>;

export const ApplicationContentWrapperExample: StoryFn<typeof ApplicationContentWrapper> = () => (
  <ApplicationContentWrapper
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </ApplicationContentWrapper>
);

export const ApplicationContentWrapperSmallSizeExample: StoryFn<typeof ApplicationContentWrapper> = () => (
  <ApplicationContentWrapper
    headerHeight={0}
    open={true}
    maxWidth={350}
    contentFullWidth={false}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </ApplicationContentWrapper>
);

export const ApplicationContentWrapperWithSidebarMenuExample: StoryFn<typeof ApplicationContentWrapper> = () => {
  const [listItems, setListItems] = React.useState(menuItems);
  const handleItemClick = (index: number) => {
    const updatedListParameters = listItems.map((item, i) => {
      return (i === index) ? {...item, active: true} : {...item, active: false};
    });
    setListItems(updatedListParameters);
  };

  return <ApplicationContentWrapper
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
    menuItems={listItems}
    handleItemClick={handleItemClick}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </ApplicationContentWrapper>;
};
