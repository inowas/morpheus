import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {Grid, Page} from 'components';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Grid',
  component: Grid.Grid,
} as Meta<typeof Grid.Grid>;

export const TwoColumnGrid: StoryFn<typeof Grid.Grid> = () => (
  <Page header={'Two Column Grid'}>
    <Grid.Grid columns={2}>
      <Grid.Column>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Column>
      <Grid.Column>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Column>
      <Grid.Column>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Column>
      <Grid.Column>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Column>
    </Grid.Grid>
  </Page>
);

export const FourRowsGrid: StoryFn<typeof Grid.Grid> = () => (
  <Page header={'Four Row Grid'}>
    <Grid.Grid columns={4}>
      <Grid.Row>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Row>
      <Grid.Row>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Row>
      <Grid.Row>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Row>
      <Grid.Row>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, commodi!</Grid.Row>
    </Grid.Grid>
  </Page>
);
