import DropdownComponent from './index';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React from 'react';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Dropdown',
  component: DropdownComponent.Dropdown,
} as Meta<typeof DropdownComponent>;

export const DropdownDefault: StoryFn<typeof DropdownComponent> = () => {

  const [options, setOptions] = React.useState([
    {key: 'defaultOption1', text: 'Default Option 1', value: 'defaultOption1'},
    {key: 'defaultOption2', text: 'Default Option 2', value: 'defaultOption2'},
  ]);
  const [tags, setTags] = React.useState<string[]>([]);

  const handleAddItem = (event: React.SyntheticEvent<HTMLElement>, data: any) => {
    setOptions([...options, {key: data.value, text: data.value, value: data.value}]);
  };

  const handleChange = (event: React.SyntheticEvent<HTMLElement>, data: any) => {
    setTags(data.value as string[]);
  };

  return (<DropdownComponent.Dropdown
    allowAdditions={true}
    name="selectedKeywords"
    fluid={true}
    multiple={true}
    onAddItem={handleAddItem}
    onChange={handleChange}
    options={options}
    search={true}
    selection={true}
    value={tags}
  />);
};
