// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import Input from './Input';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Input',
  component: Input,
} as Meta<typeof Input>;


export const InputPassword: StoryFn<typeof Input> = () => (
  <Input
    label={'password'}
    type="password"
    value='123lh'
  />
);

export const InputCheckbox: StoryFn<typeof Input> = () => (
  <Input
    checked={true}
    type="checkbox"
    label='Checkbox input'
  />
);

