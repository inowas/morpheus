import React, {useEffect, useState} from 'react';
import {IChangeLayerPropertyValues, ILayer, ILayerProperty} from '../../../types/Layers.type';
import {Tab, TabPane} from 'common/components';
import LayerConfinement from './LayerConfinement';
import LayerPropertyValues from './LayerPropertyValues';

interface IProps {
  layer: ILayer;
  onChangeLayerConfinement: (layerId: string, confinement: ILayer['confinement']) => void;
  onChangeLayerProperty: (layerId: string, propertyName: ILayerProperty, values: IChangeLayerPropertyValues) => void;
  onSelectLayer: (layerId: string, propertyName?: ILayerProperty) => void;
  isTopLayer: boolean;
}

type IPropertyTab = ILayerProperty | 'confinement';

const LayerDetails = ({layer, onChangeLayerConfinement, onChangeLayerProperty, isTopLayer, onSelectLayer}: IProps) => {

  const [selectedTab, setSelectedTab] = useState<IPropertyTab>('confinement');

  useEffect(() => {
    if ('confinement' == selectedTab) {
      onSelectLayer(layer.layer_id);
      return;
    }

    onSelectLayer(layer.layer_id, selectedTab);


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  const handleSubmitDefaultValueChange = (layerId: string, propertyName: ILayerProperty) => {
    return (defaultValue: IChangeLayerPropertyValues['defaultValue']) => onChangeLayerProperty(layerId, propertyName, {defaultValue});
  };

  const handleSubmitRasterReferenceChange = (layerId: string, propertyName: ILayerProperty) => {
    return (rasterReference: IChangeLayerPropertyValues['rasterReference']) => onChangeLayerProperty(layerId, propertyName, {rasterReference});
  };

  const handleSubmitZoneChange = (layerId: string, propertyName: ILayerProperty) => {
    return (zones: IChangeLayerPropertyValues['zones']) => onChangeLayerProperty(layerId, propertyName, {zones});
  };

  return (
    <>
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
              menuItem: {
                key: 'confinement',
                content: 'Confinement',
                onClick: () => setSelectedTab('confinement'),
              },
              render: () => <TabPane>
                <LayerConfinement
                  layerType={layer.confinement}
                  onSubmit={(layerType) => onChangeLayerConfinement(layer.layer_id, layerType)}
                  readOnly={false}
                />
              </TabPane>,
            },
            {
              menuItem: {
                key: 'top',
                content: 'Top elevation',
                onClick: () => setSelectedTab('top'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
                  values={layer.properties.top}
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
              menuItem: {
                key: 'bottom',
                content: 'Bottom elevation',
                onClick: () => setSelectedTab('bottom'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
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
              menuItem: {
                key: 'hk',
                content: 'Horizontal hydraulic conductivity',
                onClick: () => setSelectedTab('hk'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
                  values={layer.properties.hk}
                  onSubmitDefaultValueChange={handleSubmitDefaultValueChange(layer.layer_id, 'hk')}
                  onSubmitRasterReferenceChange={handleSubmitRasterReferenceChange(layer.layer_id, 'hk')}
                  onSubmitZoneChange={handleSubmitZoneChange(layer.layer_id, 'hk')}
                  readOnly={false}
                  unit={'m/d'}
                />
              </TabPane>,
            }, {
              menuItem: {
                key: 'hani',
                content: 'Horizontal anisotropy',
                onClick: () => setSelectedTab('hani'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
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
              menuItem: {
                key: 'vka',
                content: 'Vertical hydraulic conductivity',
                onClick: () => setSelectedTab('vka'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
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
              menuItem: {
                key: 'specific_storage',
                content: 'Specific storage',
                onClick: () => setSelectedTab('specific_storage'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
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
              menuItem: {
                key: 'specific_yield',
                content: 'Specific yield',
                onClick: () => setSelectedTab('specific_yield'),
              },
              render: () => <TabPane>
                <LayerPropertyValues
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
    </>
  );
};

export default LayerDetails;
