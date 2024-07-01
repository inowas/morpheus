import React, {useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Icon, MenuItem} from 'semantic-ui-react';
import {DataGrid, SectionTitle, Tab, TabPane} from 'common/components';
import {IMapRef, LeafletMapProvider, Map} from 'common/components/Map';

import useLayers from '../../application/useLayers';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {BodyContent, SidebarContent} from '../components';
import LayersList from '../components/ModelLayers/LayersList';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import {MapRef} from 'common/components/Map/Map';

const LayersContainer = () => {

  const {projectId} = useParams();
  const {
    layers,
    fetchLayerPropertyImage,
    fetchLayerPropertyData,
    onChangeLayerOrder,
    onChangeLayerConfinement,
    onChangeLayerMetadata,
    onChangeLayerProperty,
    onCloneLayer,
    onDeleteLayer,
  } = useLayers(projectId as string);
  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const mapRef: IMapRef = useRef(null);

  if (!layers || !spatialDiscretization) {
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
                    <LayersList
                      layers={layers}
                      spatialDiscretization={spatialDiscretization}
                      onCloneLayer={onCloneLayer}
                      onDeleteLayer={onDeleteLayer}
                      onChangeLayerConfinement={onChangeLayerConfinement}
                      onChangeLayerMetadata={onChangeLayerMetadata}
                      onChangeLayerOrder={onChangeLayerOrder}
                      onChangeLayerProperty={onChangeLayerProperty}
                      fetchLayerPropertyImage={fetchLayerPropertyImage}
                      fetchLayerPropertyData={fetchLayerPropertyData}
                      readOnly={isReadOnly}
                    />
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
        <Map>
          <MapRef mapRef={mapRef}/>
          <ModelGeometryMapLayer modelGeometry={spatialDiscretization?.geometry} editModelGeometry={false}/>
        </Map>
      </BodyContent>
    </>
  );
};

export default LayersContainer;
