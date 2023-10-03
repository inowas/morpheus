import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import HintPageComponent from './HintPageComponent';
import {iconIntegration} from './icon_integrations.svg';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'HintPageComponent',
  component: HintPageComponent,
} as Meta<typeof HintPageComponent>;


export const Component: StoryFn<typeof HintPageComponent> = () => (
  <HintPageComponent
    image={iconIntegration}
    header={'Integrations'}
  >
    <p>{'Here comes a small overview about the feature.'}</p>
    <p>
      {'Before you can start using the integration, you need to '}
      <a
        href={'https://www.google.com'}
        target="_blank"
      >
        {'link your account '}
      </a>
      {' and configure the integration.'}
    </p>
  </HintPageComponent>
);
