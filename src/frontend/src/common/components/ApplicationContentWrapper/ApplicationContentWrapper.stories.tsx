// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";
import React from "react";
import { ApplicationContentWrapper } from "common/components";

export default {
  title: "ApplicationContentWrapper",
  component: ApplicationContentWrapper,
} as Meta<typeof ApplicationContentWrapper>;

export const ApplicationContentWrapperExample: StoryFn<
  typeof ApplicationContentWrapper
> = () => (
  <ApplicationContentWrapper
    headerHeight={0}
    open={true}
    maxWidth={700}
    contentFullWidth={false}
    menuItems={[]}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </ApplicationContentWrapper>
);

export const ApplicationContentWrapperSmallSizeExample: StoryFn<
  typeof ApplicationContentWrapper
> = () => (
  <ApplicationContentWrapper
    headerHeight={0}
    open={true}
    maxWidth={350}
    contentFullWidth={false}
    menuItems={[]}
  >
    <div>Aside content</div>
    <div>Main content</div>
  </ApplicationContentWrapper>
);

export const ApplicationContentWrapperWithSidebarMenuExample: StoryFn<
  typeof ApplicationContentWrapper
> = () => {
  return (
    <ApplicationContentWrapper
      headerHeight={0}
      open={true}
      maxWidth={700}
      contentFullWidth={false}
      menuItems={[]}
    >
      <div>Aside content</div>
      <div>Main content</div>
    </ApplicationContentWrapper>
  );
};
