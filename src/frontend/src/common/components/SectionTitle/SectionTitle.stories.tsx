// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';
import SectionTitle from 'common/components/SectionTitle';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'SectionTitle',
  component: SectionTitle,
} as Meta<typeof SectionTitle>;

export const SectionTitleExample: StoryFn<typeof SectionTitle> = () => {


  return (
    <SectionTitle title={'Section Title'}/>
  );
};


