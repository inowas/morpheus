import React, {useState} from 'react';
import {Accordion, AccordionPanelProps, Form, Icon, Input, Label, TabPane} from 'semantic-ui-react';
import {Button, DataGrid, InfoTitle, SectionTitle, Tab} from 'common/components';
import Slider from 'common/components/Slider/SimpleSlider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload, faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {ISpatialDiscretization} from '../../../types';

interface IProps {
  spatialDiscretization?: ISpatialDiscretization;
  onChange: (data: ISpatialDiscretization) => void;
  locked: boolean;
  onChangeLock: (locked: boolean) => void;
}

const SpatialDiscretizationContent = ({spatialDiscretization, onChange, locked, onChangeLock}: IProps) => {

  const renderGridPropertiesTab = () => {
    return (
      <>
        <DataGrid columns={4}>
          <Form.Field>
            <Label className="labelSmall">
              <Icon name="info circle"/>
              Number of rows
            </Label>
            <Input
              type="number"
              defaultValue={100}
              step={1}
            />
          </Form.Field>
          <Form.Field>
            <Label className="labelSmall">
              <Icon name="info circle"/>
              Number of columns
            </Label>
            <Input
              type="number"
              defaultValue={100}
              step={1}
            />
          </Form.Field>
          <Form.Field>
            <Label className="labelSmall">
              <Icon name="info circle"/>
              Cell height (m)
            </Label>
            <Input
              type="number"
              defaultValue={101.5}
              step={0.1}
            />
          </Form.Field>
          <Form.Field>
            <Label className="labelSmall">
              <Icon name="info circle"/>
              Cell width (m)
            </Label>
            <Input
              type="number"
              defaultValue={100.1}
              step={0.1}
            />
          </Form.Field>
        </DataGrid>
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
          <Button
            size={'tiny'}
          >
            {'Reset'}
          </Button>
          <Button
            primary={true}
            size={'tiny'}
          >
            {'Apply'}
          </Button>
        </DataGrid>
      </>
    );
  };


  const [gridRotation, setGridRotation] = useState({
    rotationAngle: 12000,
    intersection: 0,
  });


  const renderRotationTab = () => {

    const handleRotationChange = (newValue: number | number[]) => {
      const newRotationAngle = Array.isArray(newValue) ? newValue[0] : newValue;
      setGridRotation({...gridRotation, rotationAngle: newRotationAngle});
    };

    const handleIntersectionChange = (newValue: number | number[]) => {
      const newIntersection = Array.isArray(newValue) ? newValue[0] : newValue;
      setGridRotation({...gridRotation, intersection: newIntersection});
    };

    return (
      <>
        <DataGrid>
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
        </DataGrid>
        <DataGrid style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
          <Button
            size={'tiny'}
          >
            {'Reset'}
          </Button>
          <Button
            primary={true}
            size={'tiny'}
          >
            {'Apply'}
          </Button>
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
            actions={[
              {actionText: 'Edit domain', actionDescription: 'Action Description', onClick: () => console.log('Action 1')},
              {actionText: 'Active cells', actionDescription: 'Action Description', onClick: () => console.log('Action 2')},
            ]}
          />
          <Button
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
                  size={'tiny'}
                >Choose file</Button>
                <Button
                  className='buttonLink'
                >
                    Download template <FontAwesomeIcon icon={faDownload}/></Button>
              </TabPane>,
            },
            {
              menuItem: 'Rotation',
              render: () => <TabPane attached={false}>
                {renderRotationTab()}
              </TabPane>,
            },
          ]}
        />
      ),
    },
  }];

  return (
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
  );
};

export default SpatialDiscretizationContent;
