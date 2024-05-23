import {DataGrid, DataRow} from 'common/components';

import React, {useState} from 'react';
import {Dropdown, Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import {IBoundary, IBoundaryType} from "../../../../types/Boundaries.type";
import {ILayerId} from "../../../../types/Layers.type";


interface IProps {
  type: IBoundaryType;
  boundaries: IBoundary[];
  onChangeBoundaries: (boundaries: IBoundary[]) => void;
  isReadOnly: boolean;
  layers: ILayerMetadata[];
}

interface ILayerMetadata {
  layer_id: string;
  name: string;
}

const BoundariesForm = ({boundaries, type, onChangeBoundaries, isReadOnly, layers}: IProps) => {

  const handleLayerChange = (layerIds: ILayerId[]) => onChangeBoundaries(boundaries.map(boundary => ({...boundary, affected_layers: layerIds})));
  const [options, setOptions] = useState([{}]);
  const [tags, setTags] = useState<string[]>([]);

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

          <Dropdown
            disabled={isReadOnly}
            name="selectedLayer"
            multiple={true}
            selection={true}
            value={boundaries.length === 1 ? boundaries[0].affected_layers : []}
            options={layers.map((layer) => ({
              key: layer.layer_id,
              text: layer.name,
              value: layer.layer_id,
            }))}
            onChange={(event, {value}) => {
              if (!value) {
                return;
              }

              if (!Array.isArray(value)) {
                value = [value];
              }

              handleLayerChange(value.map((v) => String(v) as ILayerId));
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

          <Dropdown
            allowAdditions={true}
            fluid={true}
            multiple={true}
            onAddItem={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setOptions([...options, {key: data.value, text: data.value, value: data.value}])}
            onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setTags(data.value as string[])}
            options={options}
            search={true}
            selection={true}
            value={boundaries.length === 1 ? boundaries[0].tags : []}
          />

          <Dropdown
            disabled={0 === boundaries.length}
            className="dropdownTags"
            name="tags"
            clearable={true}
            multiple={true}
            selection={true}
            value={boundaries.length === 1 ? boundaries[0].tags : []}
          />
        </Form.Field>
      </DataRow>
    </Form>
  )
};

export default BoundariesForm;
