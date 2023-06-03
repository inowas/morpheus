import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Input from './Input';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Input',
  component: Input,
} as ComponentMeta<typeof Input>;


export const InputPassword: ComponentStory<typeof Input> = () => (
  <Input
    label={'password'}
    type="password"
    value='123lh'
  />
);

export const InputCheckbox: ComponentStory<typeof Input> = () => (
  <Input
    checked={true}
    type="checkbox"
    label='Checkbox input'
  />
);

