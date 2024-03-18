// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import {ModelCreate} from 'common/components';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'ModelCreate',
  component: ModelCreate,
} as Meta<typeof ModelCreate>;


export const ModelCreateExample: StoryFn<typeof ModelCreate> = () => (

  <div style={{padding: 100}}>
    <ModelCreate/>
  </div>

);
