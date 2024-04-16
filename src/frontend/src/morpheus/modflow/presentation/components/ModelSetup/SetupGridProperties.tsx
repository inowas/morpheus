import {DataGrid} from '../../../../../common/components';
import {Form, Icon, Input, Label} from 'semantic-ui-react';
import Slider from '../../../../../common/components/Slider/SimpleSlider';
import React from 'react';
import {ILengthUnit} from '../../../types';

interface IGridProperties {
  n_cols: number;
  n_rows: number;
  rotation: number;
  length_unit: ILengthUnit;
}

interface IProps {
  gridProperties: IGridProperties;
  onChange: (data: IGridProperties) => void;
}


const SetupGridProperties = ({gridProperties, onChange}: IProps) => {

  const handleRotationChange = (newValue: number | number[]) => {
    const newRotation = Array.isArray(newValue) ? newValue[0] : newValue;
    onChange({...gridProperties, rotation: newRotation});
  };

  return (
    <>
      <DataGrid columns={2}>
        <Form.Field>
          <Label className="labelSmall">
            <Icon name="info circle"/>
            Rows
          </Label>
          <Input
            type="number"
            defaultValue={gridProperties.n_rows}
            onChange={(e) => onChange({...gridProperties, n_rows: parseInt(e.target.value)})}
            step={0}
          />
        </Form.Field>
        <Form.Field>
          <Label className="labelSmall">
            <Icon name="info circle"/>
            Columns
          </Label>
          <Input
            type="number"
            defaultValue={gridProperties.n_cols}
            onChange={(e) => onChange({...gridProperties, n_cols: parseInt(e.target.value)})}
            step={0}
          />
        </Form.Field>
      </DataGrid>
      <DataGrid style={{marginTop: 20}}>
        <div className="fieldGridSlider">
          <div className="field">
            <Label className="labelSmall">
              <Icon className={'dateIcon'} name="info circle"/>
              Rotation angle (°)
            </Label>
            <Input
              name="rotationAngle"
              type="number"
              value={gridProperties.rotation}
              onChange={(e) => onChange({...gridProperties, rotation: parseInt(e.target.value)})}
              step={1}
            />
          </div>
          <Slider
            className="fieldSlider"
            min={-90}
            max={90}
            step={1}
            value={gridProperties.rotation}
            onChange={handleRotationChange}
          />
        </div>
      </DataGrid>
    </>

  );
};

export default SetupGridProperties;
