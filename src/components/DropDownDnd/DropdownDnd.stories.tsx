import React, {useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ComponentStory, ComponentMeta} from '@storybook/react';
import DropDownDnd from './DropDownDnd';
import {Segment} from 'semantic-ui-react';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'DropDownDnd',
  component: DropDownDnd,

} as ComponentMeta<typeof DropDownDnd>;

interface IDragAndDropField {
  key: string;
  label: string;
  visible: boolean;
}

export const Default: ComponentStory<typeof DropDownDnd> = () => {

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<IDragAndDropField[]>([
    {key: 'id', label: 'ID', visible: true},
    {key: 'name', label: 'Name', visible: false},
    {key: 'description', label: 'Description', visible: true},
    {key: 'created_at', label: 'Created At', visible: false},
  ]);

  return (
    <Segment
      raised={true}
      style={{
        paddingLeft: 250,
        paddingBottom: 450,
      }}
    >
      <DropDownDnd
        items={selectedFields}
        getId={item => item.key}
        getLabel={(field => field.label)}
        isChecked={(field => field.visible)}
        setChecked={((field, visible) => ({...field, visible}))}
        onClick={setOpenDropdown}
        onChange={setSelectedFields}
        isOpen={openDropdown}
      />
    </Segment>
  );
};
