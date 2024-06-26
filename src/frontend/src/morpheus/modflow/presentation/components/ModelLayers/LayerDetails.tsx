import React from 'react';
import {IChangeLayerPropertyValues, ILayer, ILayerPropertyData, ILayerPropertyName} from '../../../types/Layers.type';
import {Tab, TabPane} from 'common/components';
import LayerConfinement from './LayerConfinement';
import LayerPropertyValues from './LayerPropertyValues';
import {ISpatialDiscretization} from '../../../types';

interface IProps {
  fetchLayerPropertyData: (layerId: string, propertyName: ILayerPropertyName, format?: 'raster' | 'grid') => Promise<ILayerPropertyData | null>;
  fetchLayerPropertyImage: (layerId: string, propertyName: ILayerPropertyName) => Promise<{ imageUrl: string, colorbarUrl: string } | null>;
  layer: ILayer;
  spatialDiscretization: ISpatialDiscretization;
  onChangeLayerConfinement: (layerId: string, confinement: ILayer['confinement']) => void;
  onChangeLayerProperty: (layerId: string, propertyName: ILayerPropertyName, values: IChangeLayerPropertyValues) => void;
  isTopLayer: boolean;
}

const LayerDetails = ({layer, spatialDiscretization, onChangeLayerConfinement, onChangeLayerProperty, fetchLayerPropertyImage, fetchLayerPropertyData, isTopLayer}: IProps) => {

  const handleSubmitDefaultValueChange = (layerId: string, propertyName: ILayerPropertyName) => {
    return (defaultValue: IChangeLayerPropertyValues['defaultValue']) => onChangeLayerProperty(layerId, propertyName, {defaultValue});
  };

  const handleSubmitRasterReferenceChange = (layerId: string, propertyName: ILayerPropertyName) => {
    return (rasterReference: IChangeLayerPropertyValues['rasterReference']) => onChangeLayerProperty(layerId, propertyName, {rasterReference});
  };

  const handleSubmitZoneChange = (layerId: string, propertyName: ILayerPropertyName) => {
    return (zones: IChangeLayerPropertyValues['zones']) => onChangeLayerProperty(layerId, propertyName, {zones});
  };

  return (
    <div className={'scrollWrapper-Y'}>
      <Tab
        variant='secondary'
        title={true}
        defaultActiveIndex={1}
        grid={{rows: 1, columns: 2}}
        menu={{fluid: true, vertical: true, tabular: true}}
        renderActiveOnly={true}
        panes={[
          {menuItem: 'Layer properties'},
          {
            menuItem: 'Confinement',
            render: () => <TabPane>
              <LayerConfinement
                layerType={layer.confinement}
                onSubmit={(layerType) => onChangeLayerConfinement(layer.layer_id, layerType)}
                readOnly={false}
              />
            </TabPane>,
          },
          {
            menuItem: 'Top elevation',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'top', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'top')}
                values={layer.properties.top}
                spatialDiscretization={spatialDiscretization}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'top')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'top')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'top')}
                readOnly={false}
                unit={'m asl'}
              />
            </TabPane>,
            isDisabled: !isTopLayer,
          },
          {
            menuItem: 'Bottom elevation',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'bottom', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'bottom')}
                spatialDiscretization={spatialDiscretization}
                values={layer.properties.bottom}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'bottom')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'bottom')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'bottom')}
                readOnly={false}
                unit={'m asl'}
              />
            </TabPane>,
          },
          {
            menuItem: 'Hydraulic conductivity',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'hk', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'hk')}
                spatialDiscretization={spatialDiscretization}
                values={layer.properties.hk}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'hk')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'hk')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'hk')}
                readOnly={false}
                unit={'m/d'}
              />
            </TabPane>,
          }, {
            menuItem: 'Horizontal Anisotropy',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'hani', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'hani')}
                spatialDiscretization={spatialDiscretization}
                values={layer.properties.hani}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'hani')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'hani')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'hani')}
                readOnly={false}
                unit={'m/d'}
              />
            </TabPane>,
          },
          {
            menuItem: 'Vertical hydraulic conductivity',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'vka', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'vka')}
                spatialDiscretization={spatialDiscretization}
                values={layer.properties.vka}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'vka')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'vka')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'vka')}
                readOnly={false}
                unit={'m/d'}
              />
            </TabPane>,
          },
          {
            menuItem: 'Specific storage',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'specific_storage', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'specific_storage')}
                spatialDiscretization={spatialDiscretization}
                values={layer.properties.specific_storage}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'specific_storage')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'specific_storage')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'specific_storage')}
                readOnly={false}
                unit={'1/m'}
              />
            </TabPane>,
          },
          {
            menuItem: 'Specific yield',
            render: () => <TabPane>
              <LayerPropertyValues
                fetchLayerPropertyData={() => fetchLayerPropertyData(layer.layer_id, 'specific_yield', 'grid')}
                fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'specific_yield')}
                spatialDiscretization={spatialDiscretization}
                values={layer.properties.specific_yield}
                onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'specific_yield')}
                onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'specific_yield')}
                onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'specific_yield')}
                readOnly={false}
                unit={'-'}
              />
            </TabPane>,
          },
        ]}
      />
    </div>
  );
};

export default LayerDetails;
