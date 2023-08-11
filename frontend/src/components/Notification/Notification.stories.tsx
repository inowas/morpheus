import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
import Notification from './Notification';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Notification',
  component: Notification,
} as Meta<typeof Notification>;

export const Warning: StoryFn<typeof Notification> = () => <Notification warning={true}>Warning notification text</Notification>;
export const Error: StoryFn<typeof Notification> = () => <Notification error={true}>Error notification text</Notification>;
export const Success: StoryFn<typeof Notification> = () => <Notification success={true}>Success notification text</Notification>;
