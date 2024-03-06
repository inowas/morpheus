import {DataGrid, DataRow} from '../index';
import {Form, Icon, Radio} from 'semantic-ui-react';
import React, {useState} from 'react';

import Button from 'components/Button/Button';
import Slider from 'components/Slider/SimpleSlider';
import styles from '../Models.module.less';

const ModelGeometry: React.FC = () => {

  const [gridType, setGridType] = useState<'gridSize' | 'cellSize'>('gridSize');
  const handleGridTypeChange = (value: 'gridSize' | 'cellSize') => {
    setGridType(value);
  };

  const [gridRotation, setGridRotation] = useState({
    rotationAngle: 12000,
    intersection: 0,
  });

  const handleRotationChange = (newValue: number | number[]) => {
    const newRotationAngle = Array.isArray(newValue) ? newValue[0] : newValue;
    setGridRotation({...gridRotation, rotationAngle: newRotationAngle});
  };

  const handleIntersectionChange = (newValue: number | number[]) => {
    const newIntersection = Array.isArray(newValue) ? newValue[0] : newValue;
    setGridRotation({...gridRotation, intersection: newIntersection});
  };

  return <>
    <DataGrid>
      <DataRow title={'Model Grid'}/>
      <DataRow subTitle={'Grid resolution'}>
        <DataGrid multiColumns={2}>
          <div>
            <Radio
              style={{marginBottom: '14px', fontSize: '16px', fontWeight: '500'}}
              label="Set by grid size"
              value="gridSize"
              checked={'gridSize' === gridType}
              onChange={() => handleGridTypeChange('gridSize')}
            />
            <div className="fieldGrid">
              <div className="fieldRow">
                <Form.Field className={styles.field}>
                  <label className="labelSmall">
                    <Icon className={'dateIcon'} name="info circle"/>
                    Number of rows
                  </label>
                  <input
                    type="number"
                    defaultValue={59}
                    step={0.5}
                    disabled={'cellSize' === gridType}
                  />
                </Form.Field>
              </div>
              <div className="fieldRow">
                <Form.Field className={styles.field}>
                  <label className="labelSmall">
                    <Icon className={'dateIcon'} name="info circle"/>
                    Time unit
                  </label>
                  <input
                    type="number"
                    defaultValue={112}
                    step={0.5}
                    disabled={'cellSize' === gridType}
                  />
                </Form.Field>
              </div>
            </div>
          </div>
          <div>
            <Radio
              style={{marginBottom: '14px', fontSize: '16px', fontWeight: '500'}}
              label="Set by cell size"
              value="cellSize"
              checked={'cellSize' === gridType}
              onChange={() => handleGridTypeChange('cellSize')}
            />
            <div className="fieldGrid">
              <div className="fieldRow">
                <Form.Field className={styles.field}>
                  <label className="labelSmall">
                    <Icon className={'dateIcon'} name="info circle"/>
                    Number of rows
                  </label>
                  <input
                    type="number"
                    defaultValue={101.5}
                    step={0.5}
                    disabled={'gridSize' === gridType}
                  />
                </Form.Field>
              </div>
              <div className="fieldRow">
                <Form.Field className={styles.field}>
                  <label className="labelSmall">
                    <Icon className={'dateIcon'} name="info circle"/>
                    Time unit
                  </label>
                  <input
                    type="number"
                    defaultValue={101.1}
                    step={0.5}
                    disabled={'gridSize' === gridType}
                  />
                </Form.Field>
              </div>
            </div>
          </div>
        </DataGrid>
      </DataRow>
      {/*// ButtonGroup*/}
      <DataRow subTitle={'Edit active cells'}>
        <div className={styles.buttonGroup} style={{display: 'flex', gap: '15px'}}>
          <Button
            primary={true} size={'small'}
          >
            {'Single selection'}
          </Button>
          <Button
            primary={true} size={'small'}
          >
            {'Multiple selection'}
          </Button>
        </div>
      </DataRow>
      {/*// SliderGroup*/}
      <DataRow subTitle={'Grid rotation'}>
        <div className="fieldGridSlider">
          <div className="field">
            <label className="labelSmall">
              <Icon className={'dateIcon'} name="info circle"/>
              Rotation angle (°)
            </label>
            <input
              name="rotationAngle"
              type="number"
              value={gridRotation.rotationAngle}
              onChange={(e) => handleRotationChange(parseInt(e.target.value))}
              step={1}
            />
          </div>
          <Slider
            className="fieldSlider"
            min={0}
            max={24000}
            step={100}
            value={gridRotation.rotationAngle}
            onChange={handleRotationChange}
          />
        </div>
        <div className="fieldGridSlider">
          <div className="field">
            <label className="labelSmall">
              <Icon className={'dateIcon'} name="info circle"/>
              Intersection
            </label>
            <input
              name="intersection"
              type="number"
              value={gridRotation.intersection}
              onChange={(e) => handleIntersectionChange(parseInt(e.target.value))}
              step={1}
            />
          </div>
          <Slider
            className="fieldSlider"
            min={0}
            max={24000}
            step={100}
            value={gridRotation.intersection}
            onChange={handleIntersectionChange}
          />
        </div>
      </DataRow>
      {/*// ButtonGroup*/}
      <DataRow subTitle={'Grid refinement'} className="borderBottom">
        <div className={styles.buttonGroup}>
          <Button
            primary={true} size={'small'}
          >
            {'Upload GeoJSON'}
          </Button>
          <Button
            primary={true} size={'small'}
          >
            {'Local refinement on map'}
          </Button>
        </div>
        <span className="required">*Download GeoJSON template</span>
      </DataRow>
      {/*// ButtonGroup*/}
      <DataRow>
        <div className={styles.buttonGroupRight}>
          <Button>
            {'Undo'}
          </Button>
          <Button
            primary={true}
          >
            {'Calculate cells'}
          </Button>
        </div>
      </DataRow>
    </DataGrid>
  </>;
};

export default ModelGeometry;
