import {DataGrid, DataRow} from 'common/components';

import React from 'react';
import {Dropdown, Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import {IBoundaries} from '../type/BoundariesContent.type';


interface IProps {
  boundaries: IBoundaries[];
  selectedItems: string[];
  onSelect: (id: string[]) => void;

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

const BoundariesForm = ({boundaries, selectedItems, onSelect}: IProps) => {
  const handleLayerChange = (event: React.SyntheticEvent, {value}: any) => {
    onSelect(value);
  };


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
          <Dropdown
            name="selectedLayer"
            clearable={true}
            multiple={true}
            selection={true}
            value={selectedItems}
            options={boundaries.map((boundary) => ({
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
              name={'latitude'} type={'number'}
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
            <Input name={'longitude'} type={'number'}/>
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
          <Dropdown
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
