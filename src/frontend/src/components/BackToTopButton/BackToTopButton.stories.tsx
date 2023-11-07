import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import BackToTopButton from './BackToTopButton';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'BackToTopButton',
  component: BackToTopButton,
} as Meta<typeof BackToTopButton>;

export const ButtonExample: StoryFn<typeof BackToTopButton> = () => <BackToTopButton/>;
