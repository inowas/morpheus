import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Button from './IconButton';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'IconButton',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = () => <Button primary={true}>Button</Button>;
export const Secondary: ComponentStory<typeof Button> = () => <Button secondary={true}>Button</Button>;
export const Disabled: ComponentStory<typeof Button> = () => <Button disabled={true}>Button</Button>;
export const Loading: ComponentStory<typeof Button> = () => <Button loading={true}>Button</Button>;
export const LoadingPrimary: ComponentStory<typeof Button> = () => <Button loading={true} primary={true}>Button</Button>;
export const LoadingSecondary: ComponentStory<typeof Button> = () => <Button loading={true} secondary={true}>Button</Button>;
export const LoadingDisabled: ComponentStory<typeof Button> = () => <Button loading={true} disabled={true}>Button</Button>;
