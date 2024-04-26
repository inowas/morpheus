import React from 'react';
import {ILayer} from '../../../types/Layers.type';
import {Tab, TabPane} from 'common/components';
import LayerConfinement from './LayerConfinement';
import LayerPropertyValues from './LayerPropertyValues';

interface IProps {
  layer: ILayer;
  onChange: (layer: ILayer) => void;
}

const LayerDetails = ({layer, onChange}: IProps) => (
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
              layerType={layer.type}
              onSubmit={(layerType) => onChange({...layer, type: layerType})}
              readOnly={false}
            />
          </TabPane>,
        },
        {
          menuItem: 'Top elevation',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.top}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, top: layerPropertyValues}})}
              readOnly={false}
              unit={'m asl'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Bottom elevation',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.bottom}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, bottom: layerPropertyValues}})}
              readOnly={false}
              unit={'m asl'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Hydraulic conductivity',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.kx}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, kx: layerPropertyValues}})}
              readOnly={false}
              unit={'m/d'}
            />
          </TabPane>,
        }, {
          menuItem: 'Horizontal hydraulic conductivity',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.ky}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, ky: layerPropertyValues}})}
              readOnly={false}
              unit={'m/d'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Vertical hydraulic conductivity',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.kz}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, kz: layerPropertyValues}})}
              readOnly={false}
              unit={'m/d'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Specific storage',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.specific_storage}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, specific_storage: layerPropertyValues}})}
              readOnly={false}
              unit={'1/m'}
            />
          </TabPane>,
        },
        {
          menuItem: 'Specific yield',
          render: () => <TabPane>
            <LayerPropertyValues
              values={layer.properties.specific_yield}
              onSubmit={(layerPropertyValues) => onChange({...layer, properties: {...layer.properties, specific_yield: layerPropertyValues}})}
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
