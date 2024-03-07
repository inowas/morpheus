// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import {ModelsCreate} from 'common/components/index';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'ModelCreate',
  component: ModelsCreate,
} as Meta<typeof ModelsCreate>;


export const ModelCreateExample: StoryFn<typeof ModelsCreate> = () => (

  <div style={{padding: 100}}>
    <ModelsCreate/>
  </div>

);
