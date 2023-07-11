import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Checkbox, Grid, Page} from '../index';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Checkbox',
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

export const Horizontal: ComponentStory<typeof Checkbox> = () => (
  <Page>
    <Grid.Grid columns={3}>
      <Grid.Column>
        <Checkbox checked={true} label={'checked checkbox'}/>
      </Grid.Column>
      <Grid.Column>
        <Checkbox indeterminate={true} label={'checkbox indeterminate'}/>
      </Grid.Column>
      <Grid.Column>
        <Checkbox checked={false}/>
      </Grid.Column>
    </Grid.Grid>
  </Page>
);
