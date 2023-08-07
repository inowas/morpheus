import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Breadcrumb from './Breadcrumb';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>;

export const Primary: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb primary={true}>Button</Breadcrumb>;
export const Secondary: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb secondary={true}>Button</Breadcrumb>;
export const Disabled: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb disabled={true}>Button</Breadcrumb>;
export const Loading: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb loading={true}>Button</Breadcrumb>;
export const LoadingPrimary: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb loading={true} primary={true}>Button</Breadcrumb>;
export const LoadingSecondary: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb loading={true} secondary={true}>Button</Breadcrumb>;
export const LoadingDisabled: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb loading={true} disabled={true}>Button</Breadcrumb>;
