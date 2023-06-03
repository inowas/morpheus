import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Notification from './Notification';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

export const Warning: ComponentStory<typeof Notification> = () => <Notification warning={true}>Warning notification text</Notification>;
export const Error: ComponentStory<typeof Notification> = () => <Notification error={true}>Error notification text</Notification>;
export const Success: ComponentStory<typeof Notification> = () => <Notification success={true}>Success notification text</Notification>;
