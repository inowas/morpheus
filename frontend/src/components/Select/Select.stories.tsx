import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import Select from './Select';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Select',
  component: Select,
} as Meta<typeof Select>;

const selectOptions = [{
  key: '9kkuykbwersd',
  value: '9kkuykbwersd',
  text: 'Option1',
},
{
  key: '9kkuykbwsd',
  value: '9kkuykersd',
  text: 'Option2',
},
{
  key: '9kkuyksd',
  value: '9kkkersd',
  text: 'Option3',
}];

export const SelectExample: StoryFn<typeof Select> = () => (
  <Select options={selectOptions} placeholder={'Select option'}/>
);
