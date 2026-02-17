// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';

import React from 'react';
import Section from './Section';
import Widget from './Widget';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Section',
  component: Section,
} as Meta<typeof Section>;

export const SectionCollapsable: StoryFn<typeof Section> = () => {

  return (
    <>
      <Section
        title={'Model Geometry H1'}
        as={'h1'}
        collapsable={true}
        open={true}
      >
        <p>Model Geometry Content H1</p>
        <p>collapsable: true</p>
        <p>open: true</p>
      </Section>
      <Section
        title={'Model Geometry H2'} as={'h2'}
        collapsable={true}
        open={false}
      >
        <p>Model Geometry Content H2</p>
        <p>collapsable: true</p>
        <p>open: false</p>
      </Section>
      <Section
        title={'Model Geometry H2'} collapsable={false}
        as={'h2'}
      >
        <p>Model Geometry Content</p>
        <p>collapsable: false</p>
      </Section>
    </>
  );
};

export const WidgetExample: StoryFn<typeof Section> = () => {
  return (
    <Widget>
      <h1>Model Geometry Widget</h1>
      <p>Model Geometry Content</p>
    </Widget>
  );
};
