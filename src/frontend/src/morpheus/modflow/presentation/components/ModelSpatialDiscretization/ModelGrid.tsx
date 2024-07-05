import React from 'react';
import {Button, DataGrid} from 'common/components';
import {Form, Icon, Input, Label} from 'semantic-ui-react';
import Slider from 'common/components/Slider/SimpleSlider';
import {IGrid} from '../../../types';

interface IProps {
  grid: IGrid;
  onChange: (data: IGrid) => void;
  isDirty: boolean;
  isLoading: boolean;
  isLocked: boolean;
  onReset: () => void;
  onSubmit: () => void;
  readOnly: boolean;
}


const ModelGrid = ({isLocked, grid, onChange, onReset, isDirty, isLoading, onSubmit, readOnly}: IProps) => (
  <>
    <DataGrid columns={4}>
      <Form.Field>
        <Label className="labelSmall">
          <Icon name="info circle"/>
          Rows
        </Label>
        <Input
          disabled={isLocked || readOnly}
          type="number"
          value={grid.n_rows}
          onChange={(e) => onChange({...grid, n_rows: parseInt(e.target.value)})}
          step={0}
        />
      </Form.Field>
      <Form.Field>
        <Label className="labelSmall">
          <Icon name="info circle"/>
          Columns
        </Label>
        <Input
          disabled={isLocked || readOnly}
          type="number"
          value={grid.n_cols}
          onChange={(e) => onChange({...grid, n_cols: parseInt(e.target.value)})}
          step={0}
        />
      </Form.Field>
      <Form.Field>
        <Label className="labelSmall">
          <Icon name="info circle"/>
          Cell height (m)
        </Label>
        <Input
          disabled={true}
          type="number"
          value={(grid.total_height / grid.n_rows).toFixed(1)}
          step={0.1}
        />
      </Form.Field>
      <Form.Field>
        <Label className="labelSmall">
          <Icon name="info circle"/>
          Cell width (m)
        </Label>
        <Input
          disabled={true}
          value={(grid.total_width / grid.n_cols).toFixed(1)}
        />
      </Form.Field>
    </DataGrid>
    <DataGrid style={{marginTop: 20}}>
      <div className="fieldGridSlider">
        <div className="field">
          <Label className="labelSmall">
            <Icon className={'dateIcon'} name="info circle"/>
            Rotation (°)
          </Label>
          <Input
            disabled={isLocked || readOnly}
            name="rotationAngle"
            type="number"
            value={grid.rotation}
            onChange={(e) => onChange({...grid, rotation: parseInt(e.target.value)})}
            step={1}
          />
        </div>
        <Slider
          disabled={isLocked || readOnly}
          className="fieldSlider"
          min={-45}
          max={45}
          step={1}
          value={grid.rotation}
          onChange={(value) => onChange({...grid, rotation: value as number})}
        />
      </div>
    </DataGrid>
    {!isLocked && !readOnly && <DataGrid style={{display: 'flex', gap: 10, marginTop: 20}}>
      <Button
        style={{marginLeft: 'auto'}}
        size={'tiny'}
        disabled={!isDirty}
        onClick={onReset}
      >
        {'Reset'}
      </Button>
      <Button
        primary={true}
        size={'tiny'}
        disabled={!isDirty}
        onClick={onSubmit}
        loading={isLoading}
      >
        {'Apply'}
      </Button>
    </DataGrid>}
  </>
);

export default ModelGrid;
