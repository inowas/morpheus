import React from 'react';
import {Accordion, AccordionPanelProps, Form, Icon, Input, Label, TabPane} from 'semantic-ui-react';
import {Button, DataGrid, InfoTitle, SectionTitle, Tab} from 'common/components';
import Slider from 'common/components/Slider/SimpleSlider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload, faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {IGrid} from '../../../types';

interface IProps {
  grid: IGrid;
  onChange: (data: IGrid) => void;
  onEditAffectedCellsClick: () => void;
  onEditModelGeometryClick: () => void;
  readOnly: boolean;
  onChangeLock: (locked: boolean) => void;
}

const SpatialDiscretizationContent = ({grid, onChange, onEditAffectedCellsClick, onEditModelGeometryClick, readOnly, onChangeLock}: IProps) => {

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
              disabled={readOnly}
              type="number"
              defaultValue={grid.n_rows}
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
              disabled={readOnly}
              type="number"
              defaultValue={grid.n_cols}
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
                Rotation angle (°)
              </Label>
              <Input
                disabled={readOnly}
                name="rotationAngle"
                type="number"
                value={grid.rotation}
                onChange={(e) => onChange({...grid, rotation: parseInt(e.target.value)})}
                step={1}
              />
            </div>
            <Slider
              disabled={readOnly}
              className="fieldSlider"
              min={-90}
              max={90}
              step={1}
              value={grid.rotation}
              onChange={(value) => onChange({...grid, rotation: value as number})}
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
            isLocked={readOnly}
            actions={[
              {actionText: 'Edit domain', actionDescription: 'Action Description', onClick: onEditModelGeometryClick},
              {actionText: 'Affected cells', actionDescription: 'Action Description', onClick: onEditAffectedCellsClick},
            ]}
          />
          <Button
            disabled={readOnly}
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
                  disabled={readOnly}
                  size={'tiny'}
                >Choose file</Button>
                <Button
                  disabled={readOnly}
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
    <DataGrid>
      <SectionTitle
        title={'Model Geometry'}
        faIcon={<FontAwesomeIcon icon={readOnly ? faLock : faUnlock}/>}
        faIconText={readOnly ? 'Locked' : 'Unlocked'}
        faIconOnClick={() => {
          onChangeLock(!readOnly);
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
