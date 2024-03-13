import {DataGrid, DataRow} from '../index';
import {Accordion, TabPane} from 'semantic-ui-react';
import {faDownload, faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import React from 'react';
import {Button, Tab} from 'common/components';

const ModelGeometry: React.FC = () => {
  const panels: any[] = [{
    key: 1,
    title: {
      content: 'Model domain',
      icon: <span><FontAwesomeIcon icon={faLock}/>Locked</span>,
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
      icon: <span><FontAwesomeIcon icon={faUnlock}/>Unlocked</span>,
    },
    content: {
      content: (
        <Tab
          activeIndex={1}
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

  const defaultActiveIndex = Array.from({length: panels.length}, (_, index) => index);

  return <>
    <DataGrid>
      <DataRow title={'Model Geometry'}/>
      <Accordion
        defaultActiveIndex={defaultActiveIndex}
        panels={panels}
        exclusive={false}
      />
    </DataGrid>
  </>;
};

export default ModelGeometry;
