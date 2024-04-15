import React from 'react';
import {Accordion, AccordionPanelProps, Form, Icon, Input, Label, TabPane} from 'semantic-ui-react';
import {Button, DataGrid, InfoTitle, SectionTitle, Tab} from 'common/components';
import Slider from 'common/components/Slider/SimpleSlider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {ILengthUnit} from '../../../types';

interface IProps {
  gridProperties: IGridProperties;
  onEditDomainClick: () => void;
  onChange: (data: IGridProperties) => void;
  loading: boolean;
}

interface IGridProperties {
  n_cols: number;
  n_rows: number;
  rotation: number;
  length_unit: ILengthUnit;
}

const ModelSetupContent = ({gridProperties, onChange, onEditDomainClick}: IProps) => {

  const handleRotationChange = (newValue: number | number[]) => {
    const newRotation = Array.isArray(newValue) ? newValue[0] : newValue;
    onChange({...gridProperties, rotation: newRotation});
  };

  const renderGridPropertiesTab = () => {
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
                onChange={(e) => handleRotationChange(parseInt(e.target.value))}
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
              {actionText: 'Draw domain on map', actionDescription: 'Action Description', onClick: onEditDomainClick},
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
        />
        <Accordion
          defaultActiveIndex={[0, 1]}
          panels={panels}
          exclusive={false}
        />
      </DataGrid>
    </>
  );
};

export default ModelSetupContent;
