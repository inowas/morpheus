import {Form, Page} from 'components/index';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Form',
  component: Form.Form,
} as Meta<typeof Form.Form>;

const dropdownOptions = [{
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

export const Input: StoryFn<typeof Form.Form> = () => (
  <Page header={'Input Component'}>
    <Form.Input label={'input label'} value={''}/>
  </Page>
);

export const Dropdown: StoryFn<typeof Form.Form> = () => (
  <Page header={'Dropdown Component'}>
    <Form.Dropdown options={dropdownOptions} placeholder={'dropdown component'}/>
  </Page>
);

export const Radio: StoryFn<typeof Form.Form> = () => (
  <Page header={'Radio Component'}>
    <Form.Radio label={'radio button'}/>
    <Form.Radio label={'radio toggle'} toggle={true}/>
  </Page>
);

export const Group: StoryFn<typeof Form.Form> = () => (
  <Page header={'Group Component'}>
    <Form.Form>
      <Form.Group>Content</Form.Group>
      <Form.Group>Content</Form.Group>
      <Form.Group>Content</Form.Group>
    </Form.Form>
  </Page>
);


