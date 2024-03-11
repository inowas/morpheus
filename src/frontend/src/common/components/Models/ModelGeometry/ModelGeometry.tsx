import {DataGrid, DataRow} from '../index';
import {Accordion} from 'semantic-ui-react';
import {faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import React from 'react';
import InfoTitle from '../../InfoTitle';
import Button from '../../Button/Button';

const ModelGeometry: React.FC = () => {


  const panels: any[] = [{
    key: 1,
    title: {
      content: 'Model domain',
      icon: <span><FontAwesomeIcon icon={faLock}/>Locked</span>,
    },
    content: {
      content: (
        <>
          <InfoTitle
            title='Upload shapefile'
            description='Shapefile description'
            actionText='Add on map'
            actionDescription='Action description'
            onAction={() => {
              console.log('Add on map action');
            }}
          />
          <Button
            disabled={true}
            primary={true}
            size={'tiny'}
          >Choose file</Button>
        </>
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
        <>
          <InfoTitle
            title='Upload shapefile'
            description='Shapefile description'
            actionText='Add on map'
            actionDescription='Action description'
            onAction={() => {
              console.log('Add on map action');
            }}
          />
          <Button
            primary={true}
            size={'tiny'}
          >Choose file</Button>
        </>
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
