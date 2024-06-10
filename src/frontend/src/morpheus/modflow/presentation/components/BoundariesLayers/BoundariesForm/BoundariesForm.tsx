import {DataGrid, DataRow, DropdownComponent} from 'common/components';

import React, {useEffect, useState} from 'react';
import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import {IBoundaries} from '../type/BoundariesContent.type';
import {getBoundariesByType} from '../helpers/BoundariesContent.helpers';


interface IProps {
  type?: string;
  boundaries: IBoundaries[];
  selectedItems: string[];
  onSelect: (id: string[]) => void;
  onSelectObservations: (id: string[]) => void;
}

const options = [
  {key: 'wdd', text: 'wdd', value: 'wdd'},
  {key: 'inowas', text: 'inowas', value: 'inowas'},
  {key: 'htwdd', text: 'htwdd', value: 'htwdd'},
  {key: 'hwd', text: 'hwd', value: 'hwd'},
  {key: 'hdd', text: 'hdd', value: 'hdd'},
  {key: 'wbd', text: 'wbd', value: 'wbd'},
  {key: 'wvd', text: 'wvd', value: 'wvd'},
  {key: 'wq', text: 'wq', value: 'wq'},
  {key: 'wss', text: 'wss', value: 'wss'},
];

const BoundariesForm = ({boundaries, type, selectedItems, onSelect, onSelectObservations}: IProps) => {
  const [listItems, setListItems] = useState<IBoundaries[]>([]);

  const handleLayerChange = (event: React.SyntheticEvent, {value}: any) => {
    onSelect(value);
    const updatedObservationSelection: string[] = [];
    boundaries.forEach(boundary => {
      if (value.includes(boundary.id)) {
        boundary.observations.forEach(observation => {
          updatedObservationSelection.push(observation.observation_id);
        });
      }
    });
    onSelectObservations(updatedObservationSelection);
  };
  useEffect(() => {
    setListItems(type ? getBoundariesByType(boundaries, type) : boundaries);
  }, [boundaries]);

  return <>
    <Form>
      <DataRow>
        <Form.Field>
          <Label
            htmlFor="selectedLayer"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon
                name="info circle"
              />}
              content={'Select Layer'}
              hideOnScroll={true}
              size="tiny"
            />

            Select Layer
          </Label>
          <DropdownComponent.Dropdown
            disabled={0 === listItems.length}
            name="selectedLayer"
            clearable={true}
            multiple={true}
            selection={true}
            value={selectedItems}
            options={listItems.map((boundary) => ({
              key: boundary.id,
              text: boundary.name,
              value: boundary.id,
            }))}
            onChange={(event, {value}) => {
              handleLayerChange(event, {value});
            }}
          />
        </Form.Field>
        <DataGrid columns={2}>
          <Form.Field className="field">
            <Label htmlFor="latitude" className="labelSmall">
              <Popup
                trigger={<Icon
                  name="info circle"
                />}
                content={'Latitude value'}
                hideOnScroll={true}
                size="tiny"
              />

              Latitude
            </Label>
            <Input
              disabled={0 === listItems.length}
              name={'latitude'}
              type={'number'}
            />
          </Form.Field>
          <Form.Field>
            <Label htmlFor="longitude" className="labelSmall">
              <Popup
                trigger={<Icon
                  name="info circle"
                />}
                content={'Longitude value'}
                hideOnScroll={true}
                size="tiny"
              />

              Longitude
            </Label>
            <Input
              disabled={0 === listItems.length}
              name={'longitude'}
              type={'number'}
            />
          </Form.Field>
        </DataGrid>
        <Form.Field>
          <Label
            htmlFor="length"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon
                name="info circle"
              />}
              content={'Length value in meters'}
              hideOnScroll={true}
              size="tiny"
            />

            Length (m)
          </Label>
          <Input
            disabled={0 === listItems.length}
            name={'length'}
            type={'number'}
          />
        </Form.Field>
        <Form.Field>
          <Label htmlFor="tags" className="labelSmall">
            <Popup
              trigger={<Icon
                name="info circle"
              />}
              content={'Tags'}
              hideOnScroll={true}
              size="tiny"
            />

            Tags
          </Label>
          <DropdownComponent.Dropdown
            disabled={0 === listItems.length}
            className="dropdownTags"
            name="tags"
            clearable={true}
            multiple={true}
            selection={true}
            options={options}
          />
        </Form.Field>
      </DataRow>
    </Form>
  </>
  ;
};

export default BoundariesForm;
