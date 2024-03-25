import React, {useEffect, useState} from 'react';
import {Accordion, AccordionPanelProps, Form, Icon, Input, Label, TabPane} from 'semantic-ui-react';
import {Button, DataGrid, InfoTitle, SectionTitle, Tab} from 'common/components';
import Slider from 'common/components/Slider/SimpleSlider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload, faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {ISpatialDiscretization} from '../../../types';

interface IProps {
  spatialDiscretization: ISpatialDiscretization;
  onChange: (data: ISpatialDiscretization) => void;
  onEditDomainClick: () => void;
  locked: boolean;
  loading: boolean;
  onChangeLock: (locked: boolean) => void;
}

interface IGridProperties {
  n_col: number;
  n_row: number;
  rotation: number;
}

const SpatialDiscretizationContent = ({spatialDiscretization, onChange, onEditDomainClick, locked, onChangeLock, loading}: IProps) => {

  const [gridProperties, setGridProperties] = useState<IGridProperties>({
    n_col: spatialDiscretization.grid.n_col,
    n_row: spatialDiscretization.grid.n_row,
    rotation: spatialDiscretization.grid.rotation,
  });

  useEffect(() => {
    setGridProperties({
      n_col: spatialDiscretization.grid.n_col,
      n_row: spatialDiscretization.grid.n_row,
      rotation: spatialDiscretization.grid.rotation,
    });
  }, [spatialDiscretization]);

  const handleRotationChange = (newValue: number | number[]) => {
    const newRotation = Array.isArray(newValue) ? newValue[0] : newValue;
    setGridProperties({...gridProperties, rotation: newRotation});
  };

  const renderGridPropertiesTab = () => {
    return (
      <>
        <DataGrid columns={4}>
          <Form.Field>
            <Label className="labelSmall">
              <Icon name="info circle"/>
              Rows
            </Label>
            <Input
              disabled={locked}
              type="number"
              defaultValue={gridProperties.n_row}
              onChange={(e) => setGridProperties({...gridProperties, n_row: parseInt(e.target.value)})}
              step={0}
            />
          </Form.Field>
          <Form.Field>
            <Label className="labelSmall">
              <Icon name="info circle"/>
              Columns
            </Label>
            <Input
              disabled={locked}
              type="number"
              defaultValue={gridProperties.n_col}
              onChange={(e) => setGridProperties({...gridProperties, n_col: parseInt(e.target.value)})}
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
              value={(spatialDiscretization.grid.total_height / gridProperties.n_row).toFixed(1)}
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
              value={(spatialDiscretization.grid.total_width / gridProperties.n_col).toFixed(1)}
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
                disabled={locked}
                name="rotationAngle"
                type="number"
                value={gridProperties.rotation}
                onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                step={1}
              />
            </div>
            <Slider
              disabled={locked}
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


  const panels: AccordionPanelProps[] = [{
    key: 1,
    title: {
      content: 'Model domain',
      icon: false,
    },
    content: {
      content: (
        <>
          <InfoTitle
            title={'Upload file'}
            secondary={true}
            isLocked={locked}
            actions={[
              {actionText: 'Edit domain', actionDescription: 'Action Description', onClick: onEditDomainClick},
              {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
            ]}
          />
          <Button
            disabled={locked}
            size={'tiny'}
          >Choose file</Button>
        </>
      ),
    },
  },
  {
    key: 2,
    title: {
      content: 'Model grid',
      icon: false,
    },
    content: {
      content: (
        <Tab
          variant='primary'
          menu={{pointing: true}}
          panes={[
            {
              menuItem: 'Grid Properties',
              render: () => <TabPane attached={false}>
                {renderGridPropertiesTab()}
              </TabPane>,
            },
            {
              menuItem: 'Upload file',
              render: () => <TabPane attached={false}>
                <Button
                  disabled={locked}
                  size={'tiny'}
                >Choose file</Button>
                <Button
                  disabled={locked}
                  className='buttonLink'
                >
                    Download template <FontAwesomeIcon icon={faDownload}/></Button>
              </TabPane>,
            },
          ]}
        />
      ),
    },
  }];

  return (
    <>
      <DataGrid>
        <SectionTitle
          title={'Model Geometry'}
          faIcon={<FontAwesomeIcon icon={locked ? faLock : faUnlock}/>}
          faIconText={locked ? 'Locked' : 'Unlocked'}
          faIconOnClick={() => {
            onChangeLock(!locked);
          }}
        />
        <Accordion
          defaultActiveIndex={[0, 1]}
          panels={panels}
          exclusive={false}
        />
      </DataGrid>
      <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
        <Button
          style={{marginLeft: 'auto'}}
          size={'tiny'}
          disabled={locked}
          onClick={() => setGridProperties({
            n_col: spatialDiscretization.grid.n_col,
            n_row: spatialDiscretization.grid.n_row,
            rotation: spatialDiscretization.grid.rotation,
          })}
        >
          {'Reset'}
        </Button>
        <Button
          primary={true}
          size={'tiny'}
          disabled={locked || gridProperties.n_col === spatialDiscretization.grid.n_col && gridProperties.n_row === spatialDiscretization.grid.n_row && gridProperties.rotation === spatialDiscretization.grid.rotation}
          onClick={() => onChange({...spatialDiscretization, grid: {...spatialDiscretization.grid, ...gridProperties}})}
          loading={loading}
        >
          {'Apply'}
        </Button>
      </DataGrid>
    </>
  );
};

export default SpatialDiscretizationContent;
