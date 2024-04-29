import React from 'react';
import {ILayer, ILayerPropertyName, ILayerPropertyValues} from '../../../types/Layers.type';
import {Tab, TabPane} from 'common/components';
import LayerConfinement from './LayerConfinement';
import LayerPropertyValues from './LayerPropertyValues';
import {ISpatialDiscretization} from '../../../types';

interface IProps {
  fetchLayerPropertyImage: (layerId: string, propertyName: ILayerPropertyName) => Promise<{ imageUrl: string, colorbarUrl: string } | null>;
  layer: ILayer;
  spatialDiscretization: ISpatialDiscretization;
  onChangeLayerConfinement: (layerId: string, confinement: ILayer['confinement']) => void;
  onChangeLayerProperty: (layerId: string, propertyName: ILayerPropertyName, values: ILayerPropertyValues) => void;
}

const LayerDetails = ({layer, spatialDiscretization, onChangeLayerConfinement, onChangeLayerProperty, fetchLayerPropertyImage}: IProps) => (
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
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'top')}
              values={layer.properties.top}
              spatialDiscretization={spatialDiscretization}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'top', layerPropertyValues)}
              readOnly={false}
              unit={'m asl'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Bottom elevation',
          render: () => <TabPane>
            <LayerPropertyValues
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'bottom')}
              spatialDiscretization={spatialDiscretization}
              values={layer.properties.bottom}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'bottom', layerPropertyValues)}
              readOnly={false}
              unit={'m asl'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Hydraulic conductivity',
          render: () => <TabPane>
            <LayerPropertyValues
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'hk')}
              spatialDiscretization={spatialDiscretization}
              values={layer.properties.hk}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'hk', layerPropertyValues)}
              readOnly={false}
              unit={'m/d'}
            />
          </TabPane>,
        }, {
          menuItem: 'Horizontal Anisotropy',
          render: () => <TabPane>
            <LayerPropertyValues
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'hani')}
              spatialDiscretization={spatialDiscretization}
              values={layer.properties.hani}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'hani', layerPropertyValues)}
              readOnly={false}
              unit={'m/d'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Vertical hydraulic conductivity',
          render: () => <TabPane>
            <LayerPropertyValues
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'vka')}
              spatialDiscretization={spatialDiscretization}
              values={layer.properties.vka}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'vka', layerPropertyValues)}
              readOnly={false}
              unit={'m/d'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Specific storage',
          render: () => <TabPane>
            <LayerPropertyValues
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'specific_storage')}
              spatialDiscretization={spatialDiscretization}
              values={layer.properties.specific_storage}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'specific_storage', layerPropertyValues)}
              readOnly={false}
              unit={'1/m'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Specific yield',
          render: () => <TabPane>
            <LayerPropertyValues
              fetchLayerPropertyImage={() => fetchLayerPropertyImage(layer.layer_id, 'specific_yield')}
              spatialDiscretization={spatialDiscretization}
              values={layer.properties.specific_yield}
              onSubmit={(layerPropertyValues) => onChangeLayerProperty(layer.layer_id, 'specific_yield', layerPropertyValues)}
              readOnly={false}
              unit={'-'}
            />
          </TabPane>,
        },
      ]}
    />
  </div>
);

export default LayerDetails;
