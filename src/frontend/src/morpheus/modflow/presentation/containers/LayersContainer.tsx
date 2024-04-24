import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import SpatialDiscretizationMap from '../components/ModelSpatialDiscretization/SpatialDiscretizationMap';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';
import {useParams} from 'react-router-dom';
import useLayers from '../../application/useLayers';
import {DataGrid, SectionTitle, Tab} from '../../../../common/components';
import {Icon, MenuItem, TabPane} from 'semantic-ui-react';
import LayersList from '../components/ModelLayers/LayersList';


const LayersContainer = () => {

  const {projectId} = useParams();
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {layers, onOrderChange} = useLayers(projectId as string);

  if (!layers) {
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
                  <LayersList layers={layers} onOrderChange={onOrderChange}/>
                </TabPane>,
            }, {
              menuItem: <MenuItem key='validation' className='tabItemWithIcon'>Validation<Icon name='check circle'/></MenuItem>,
              render: () => <TabPane attached={false}>Validation</TabPane>,
            }]}
          />
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <SpatialDiscretizationMap modelGeometry={spatialDiscretization?.geometry}/>
      </BodyContent>
    </>
  );
};

export default LayersContainer;
