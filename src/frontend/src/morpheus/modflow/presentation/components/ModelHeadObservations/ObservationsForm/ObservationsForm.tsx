import React, {useState} from 'react';

import {Form, Icon, Label, Popup, DropdownItemProps} from 'semantic-ui-react';
import {DataRow, DropdownComponent} from 'common/components';

import {ILayerId} from '../../../../types/Layers.type';
import {IHeadObservation} from '../../../../types/HeadObservations.type';

interface IProps {
  observation: IHeadObservation | null;
  onChange: (observation: IHeadObservation) => void;
  layers: {layer_id: string, name: string}[];
  isReadOnly: boolean;
}

const ObservationsForm = ({observation, onChange, isReadOnly, layers}: IProps) => {

  const [tagOptions, setTagOptions] = useState<DropdownItemProps[]>([]);

  if (!observation) {
    return null;
  }

  return (
    <Form>
      <DataRow>
        <Form.Field>
          <Label
            htmlFor="selectedLayer"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Select Layer'}
              hideOnScroll={true}
              size="tiny"
            />
            Select Layer
          </Label>

          <DropdownComponent.Dropdown
            disabled={isReadOnly}
            name={'selectedLayer'}
            multiple={false}
            selection={true}
            value={observation.affected_layers}
            options={layers.map((layer) => ({
              key: layer.layer_id,
              text: layer.name,
              value: layer.layer_id,
            }))}
            onChange={(_, {value}) => {
              if (!value) {
                return;
              }
              if (!Array.isArray(value)) {
                value = [value];
              }
              onChange({...observation, affected_layers: value as ILayerId[]});
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label htmlFor="tags" className="labelSmall">
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Tags'}
              hideOnScroll={true}
              size="tiny"
            />
            Tags
          </Label>
          <DropdownComponent.Dropdown
            disabled={isReadOnly}
            allowAdditions={true}
            fluid={true}
            multiple={true}
            onAddItem={(_: React.SyntheticEvent<HTMLElement, Event>, data: any) => setTagOptions([...tagOptions, {key: data.value, text: data.value, value: data.value}])}
            onChange={(_: React.SyntheticEvent<HTMLElement, Event>, data: any) => onChange({...observation, tags: data.value as string[]})}
            options={tagOptions}
            search={true}
            selection={true}
            value={observation.tags}
          />
        </Form.Field>
        <Form.Field>
          <Label htmlFor="tags" className="labelSmall">
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Interpolation Type, default is none. Meaning no interpolation is applied and values for each stress period have to be provided.'}
              hideOnScroll={true}
              size="tiny"
            />
            Interpolation Type
          </Label>
        </Form.Field>
      </DataRow>
    </Form>
  );
};

export default ObservationsForm;
