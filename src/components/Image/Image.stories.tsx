import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Image from './Image';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Image',
  component: Image,
} as ComponentMeta<typeof Image>;


export const ImageExample: ComponentStory<typeof Image> = () => (
  <Image
    content={'ITEXIA Image'} src={'image'}
    rounded={true}
  />
);
