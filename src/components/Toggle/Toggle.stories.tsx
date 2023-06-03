import React, {useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentMeta, ComponentStory} from '@storybook/react';
import Toggle from './Toggle';
import {Page} from '../index';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Toggle',
  component: Toggle,
} as ComponentMeta<typeof Toggle>;

export const ToggleExample: ComponentStory<typeof Toggle> = () => {
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
