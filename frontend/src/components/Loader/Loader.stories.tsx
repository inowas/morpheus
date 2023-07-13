import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Loader from './Loader';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Loader',
  component: Loader,
} as ComponentMeta<typeof Loader>;


export const LoaderActive: ComponentStory<typeof Loader> = () => (
  <Loader active={true}/>
);

export const LoaderInverter: ComponentStory<typeof Loader> = () => (
  <Loader active={true} inverted={true}/>
);


