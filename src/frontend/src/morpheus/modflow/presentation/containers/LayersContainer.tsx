import React, {useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Icon, MenuItem} from 'semantic-ui-react';
import {DataGrid, SectionTitle, Tab, TabPane} from 'common/components';

import {BodyContent, SidebarContent} from '../components';
import useLayers from '../../application/useLayers';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';
import LayersList from '../components/ModelLayers/LayersList';
import {IMapRef, LeafletMapProvider} from 'common/components/Map';
import LayersMap from '../components/ModelLayers/LayersMap';


const LayersContainer = () => {

  const {projectId} = useParams();
  const {layers, onOrderChange} = useLayers(projectId as string);
  const {geometry} = useSpatialDiscretization(projectId as string);
  const mapRef: IMapRef = useRef(null);

  if (!layers || !geometry) {
    return null;
  }

  return (
    <>
      <SidebarContent maxWidth={700}>
        <DataGrid>
          <SectionTitle title={'Layers'}/>
          <Tab
            variant='primary'
            menu={{secondary: true, pointing: true}}
            panes={[{
              menuItem: <MenuItem key='properties'>Properties</MenuItem>,
              render: () =>
                <TabPane attached={false}>
                  <LeafletMapProvider mapRef={mapRef}>
                    <LayersList layers={layers} onOrderChange={onOrderChange}/>
                  </LeafletMapProvider>
                </TabPane>,
            }, {
              menuItem: <MenuItem key='validation' className='tabItemWithIcon'>Validation<Icon name='check circle'/></MenuItem>,
              render: () => <TabPane attached={false}>Validation</TabPane>,
            }]}
          />
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <LayersMap modelGeometry={geometry} mapRef={mapRef}/>
      </BodyContent>
    </>
  );
};

export default LayersContainer;
