import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button, Icon, Menu, MenuItem, MenuMenu} from 'semantic-ui-react';
import {DataGrid, SectionTitle} from 'common/components';
import {IMapRef, LeafletMapProvider, Map} from 'common/components/Map';

import useLayers from '../../application/useLayers';
import useProjectPrivileges from '../../application/useProjectPrivileges';
import useSpatialDiscretization from '../../application/useSpatialDiscretization';

import {BodyContent, SidebarContent} from '../components';
import LayersList from '../components/ModelLayers/LayersList';
import ModelGeometryMapLayer from '../components/ModelSpatialDiscretization/ModelGeometryMapLayer';
import {MapRef} from 'common/components/Map/Map';
import {IChangeLayerPropertyValues, ILayerId, ILayerProperty, ILayerPropertyData} from '../../types/Layers.type';
import CanvasDataLayer from 'common/components/Map/DataLayers/CanvasDataLayer';
import {useColorMap} from 'common/hooks';

interface ISelectedLayer {
  layerId: ILayerId;
  property?: ILayerProperty;
}

const LayersContainer = () => {

  const {projectId} = useParams();
  const {
    layers,
    fetchLayerPropertyData,
    onAddLayer,
    onChangeLayerOrder,
    onChangeLayerConfinement,
    onChangeLayerMetadata,
    onChangeLayerProperty,
    onCloneLayer,
    onDeleteLayer,
    loading,
  } = useLayers(projectId as string);

  const {spatialDiscretization} = useSpatialDiscretization(projectId as string);
  const {isReadOnly} = useProjectPrivileges(projectId as string);

  const [selectedLayer, setSelectedLayer] = useState<ISelectedLayer | null>(null);
  const [layerPropertyData, setLayerPropertyData] = useState<ILayerPropertyData | null>(null);

  const {getRgbColor} = useColorMap('gist_earth');

  useEffect(() => {
    if (!selectedLayer || !selectedLayer.property) {
      return;
    }

    fetchLayerPropertyData(selectedLayer.layerId, selectedLayer.property, 'grid')
      .then((data) => setLayerPropertyData(data));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLayer]);

  const handleChangeLayerProperty = async (layerId: string, propertyName: ILayerProperty, values: IChangeLayerPropertyValues) => {
    await onChangeLayerProperty(layerId, propertyName, values);
    const data = await fetchLayerPropertyData(layerId, propertyName, 'grid');
    setLayerPropertyData(data);
  };

  const handleAddLayer = () => {
    onAddLayer();
  };

  const mapRef: IMapRef = useRef(null);

  if (!layers || !spatialDiscretization) {
    return null;
  }

  return (
    <>
      <SidebarContent maxWidth={500}>
        <DataGrid>
          <SectionTitle title={'Layers'}/>
          <div>
            <Menu pointing={true} secondary={true}>
              <MenuItem key='properties' style={{fontWeight: 'bold'}}>Properties</MenuItem>
              {!isReadOnly && (
                <MenuMenu position='right'>
                  <MenuItem>
                    <Button
                      size={'tiny'}
                      onClick={handleAddLayer} icon={true}
                      labelPosition={'right'} primary={true}
                      loading={loading}
                    >
                      <Icon name='plus'/>
                      Add Layer
                    </Button>
                  </MenuItem>
                </MenuMenu>
              )}
            </Menu>
            <LeafletMapProvider mapRef={mapRef}>
              <LayersList
                layers={layers}
                onCloneLayer={onCloneLayer}
                onDeleteLayer={onDeleteLayer}
                onChangeLayerConfinement={onChangeLayerConfinement}
                onChangeLayerMetadata={onChangeLayerMetadata}
                onChangeLayerOrder={onChangeLayerOrder}
                onChangeLayerProperty={handleChangeLayerProperty}
                onSelectLayer={(layerId, property) => setSelectedLayer({layerId, property})}
                readOnly={isReadOnly}
              />
            </LeafletMapProvider>
          </div>
        </DataGrid>
      </SidebarContent>
      <BodyContent>
        <Map>
          <MapRef mapRef={mapRef}/>
          <ModelGeometryMapLayer
            modelGeometry={spatialDiscretization?.geometry}
            editModelGeometry={false}
            fill={true}
          />
          {layerPropertyData && <CanvasDataLayer
            title={selectedLayer?.property || ''}
            data={layerPropertyData.data}
            rotation={layerPropertyData.rotation}
            outline={layerPropertyData.outline}
            minValue={layerPropertyData.min_value}
            maxValue={layerPropertyData.max_value}
            getRgbColor={getRgbColor}
            selectRowsAndCols={false}
          />}
        </Map>
      </BodyContent>
    </>
  );
};

export default LayersContainer;
