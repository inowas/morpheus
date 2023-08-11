import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
import Button from './Button';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  component: Button,
} as Meta<typeof Button>;

export const Primary: StoryFn<typeof Button> = () => <Button primary={true}>Button</Button>;
export const Secondary: StoryFn<typeof Button> = () => <Button secondary={true}>Button</Button>;
export const Disabled: StoryFn<typeof Button> = () => <Button disabled={true}>Button</Button>;
export const Loading: StoryFn<typeof Button> = () => <Button loading={true}>Button</Button>;
export const LoadingPrimary: StoryFn<typeof Button> = () => <Button loading={true} primary={true}>Button</Button>;
export const LoadingSecondary: StoryFn<typeof Button> = () => <Button loading={true} secondary={true}>Button</Button>;
export const LoadingDisabled: StoryFn<typeof Button> = () => <Button loading={true} disabled={true}>Button</Button>;
