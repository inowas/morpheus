// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {FormModelCreate} from 'components/index';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'FormModelCreate',
  component: FormModelCreate,
} as Meta<typeof FormModelCreate>;


export const FormModelCreateExample: StoryFn<typeof FormModelCreate> = () => (

  <div style={{padding: 100}}>
    <FormModelCreate/>
  </div>

);
