// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React, {useState} from 'react';

import {Page} from '../index';
import Toggle from './Toggle';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Toggle',
  component: Toggle,
} as Meta<typeof Toggle>;

export const ToggleExample: StoryFn<typeof Toggle> = () => {
  const [value, setValue] = useState(false);

  return (<Page>
    <Toggle
      value={value}
      onChange={setValue}
      labelChecked={'Archiv'}
      labelUnchecked={'Bestand'}
    />
  </Page>);
};
