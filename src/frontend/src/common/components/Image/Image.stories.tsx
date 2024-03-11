// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Image from './Image';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Image',
  component: Image,
} as Meta<typeof Image>;


export const ImageExample: StoryFn<typeof Image> = () => (
  <Image
    content={'ITEXIA Image'} src={'image'}
    rounded={true}
  />
);
