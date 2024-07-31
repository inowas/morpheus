import React, {useMemo} from 'react';
import {Button, DataGrid, Form, Icon, Slider} from 'common/components';
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


const ModelGrid = ({isLocked, grid, onChange, onReset, isDirty, isLoading, onSubmit, readOnly}: IProps) => {

  const totalWidth = useMemo(() => grid.col_widths.reduce((a, b) => a + b, 0), [grid]);
  const totalHeight = useMemo(() => grid.row_heights.reduce((a, b) => a + b, 0), [grid]);

  return (
    <>
      <DataGrid columns={4}>
        <Form.FormField>
          <Form.Label className="labelSmall">
            <Icon name="info circle"/>
            Rows
          </Form.Label>
          <Form.Input
            disabled={isLocked || readOnly}
            type="number"
            value={String(grid.n_rows)}
            onChange={(e) => onChange({...grid, n_rows: parseInt(e.target.value)})}
            step={0}
          />
        </Form.FormField>
        <Form.FormField>
          <Form.Label className="labelSmall">
            <Icon name="info circle"/>
            Columns
          </Form.Label>
          <Form.Input
            disabled={isLocked || readOnly}
            type="number"
            value={String(grid.n_cols)}
            onChange={(e) => onChange({...grid, n_cols: parseInt(e.target.value)})}
            step={0}
          />
        </Form.FormField>
        <Form.FormField>
          <Form.Label className="labelSmall">
            <Icon name="info circle"/>
            Cell height (m)
          </Form.Label>
          <Form.Input
            disabled={true}
            type="number"
            value={(totalHeight / grid.n_rows).toFixed(1)}
            step={0.1}
          />
        </Form.FormField>
        <Form.FormField>
          <Form.Label className="labelSmall">
            <Icon name="info circle"/>
            Cell width (m)
          </Form.Label>
          <Form.Input
            disabled={true}
            value={(totalWidth / grid.n_cols).toFixed(1)}
          />
        </Form.FormField>
      </DataGrid>
      <DataGrid style={{marginTop: 20}}>
        <div className="fieldGridSlider">
          <div className="field">
            <Form.Label className="labelSmall">
              <Icon className={'dateIcon'} name="info circle"/>
              Rotation (°)
            </Form.Label>
            <Form.Input
              disabled={isLocked || readOnly}
              name="rotationAngle"
              type="number"
              value={String(grid.rotation)}
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
};

export default ModelGrid;
