import React from 'react';
import {Accordion, AccordionPanelProps, TabPane} from 'semantic-ui-react';
import {Button, DataGrid, DataRow, Tab} from 'common/components';
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

  const renderLockedIcon = (isLocked: boolean) => {
    return (
      <span>
        <FontAwesomeIcon
          icon={isLocked ? faLock : faUnlock }
          onClick={() => onChangeLock(!isLocked)}
        />
        {isLocked ? 'Locked' : 'Unlocked'}
      </span>
    );
  };

  const panels: AccordionPanelProps[] = [{
    key: 1,
    title: {
      content: 'Model domain',
      icon: renderLockedIcon(locked),
    },
    content: {
      content: (
        <TabPane style={{
          padding: 0,
          backgroundColor: 'transparent',
          border: 'none',
        }}
        >
          <Tab
            variant='primary'
            menu={{pointing: true}}
            panes={[
              {
                menuItem: 'Upload file',
                render: () => <TabPane attached={false}>
                  <Button
                    disabled={true}
                    primary={true}
                    size={'tiny'}
                  >Choose file</Button>
                </TabPane>,
              },
              {
                menuItem: 'Polygons',
                render: () => <TabPane attached={false}>Polygons</TabPane>,
              },
            ]}
          />
        </TabPane>
      ),
    },
  },
  {
    key: 2,
    title: {
      content: 'Model domain',
      icon: renderLockedIcon(locked),
    },
    content: {
      content: (
        <Tab
          variant='primary'
          menu={{pointing: true}}
          panes={[
            {
              menuItem: 'Grid Properties',
              render: () => <TabPane attached={false}>Polygons</TabPane>,
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
              menuItem: 'Polygons',
              render: () => <TabPane attached={false}>Polygons</TabPane>,
            },
          ]}
        />
      ),
    },
  }];

  return (
    <DataGrid>
      <DataRow title={'Model Geometry'}/>
      <Accordion
        defaultActiveIndex={[0, 1]}
        panels={panels}
        exclusive={false}
      />
    </DataGrid>
  );
};

export default SpatialDiscretizationContent;
