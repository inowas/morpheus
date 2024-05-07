import React, {useEffect, useState} from 'react';
import isEqual from 'lodash.isequal';

import {MovableAccordionList, IMovableAccordionItem, IMovableAccordionListAction} from 'common/components';

import LayerDetails from './LayerDetails';
import {IChangeLayerPropertyValues, ILayer, ILayerPropertyData, ILayerPropertyName} from '../../../types/Layers.type';
import {ISpatialDiscretization} from '../../../types';

interface IProps {
  fetchLayerPropertyData: (layerId: string, propertyName: ILayerPropertyName) => Promise<ILayerPropertyData | null>;
  fetchLayerPropertyImage: (layerId: string, propertyName: ILayerPropertyName) => Promise<{ imageUrl: string, colorbarUrl: string } | null>;
  layers: ILayer[];
  spatialDiscretization: ISpatialDiscretization;
  onCloneLayer: (layerId: ILayer['layer_id']) => void;
  onDeleteLayer: (layerId: ILayer['layer_id']) => void;
  onChangeLayerMetadata: (layerId: ILayer['layer_id'], name?: ILayer['name'], description?: ILayer['description']) => void;
  onChangeLayerConfinement: (layerId: ILayer['layer_id'], confinement: ILayer['confinement']) => void;
  onChangeLayerOrder: (newOrderIds: string[]) => void;
  onChangeLayerProperty: (layerId: string, propertyName: ILayerPropertyName, values: IChangeLayerPropertyValues) => void;
  readOnly: boolean;
}

const LayersList = ({
  fetchLayerPropertyData,
  fetchLayerPropertyImage,
  layers,
  spatialDiscretization,
  onCloneLayer,
  onDeleteLayer,
  onChangeLayerConfinement,
  onChangeLayerMetadata,
  onChangeLayerOrder,
  onChangeLayerProperty,
  readOnly,
}: IProps) => {

  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [layersLocal, setLayersLocal] = useState<ILayer[]>(layers);

  useEffect(() => {
    setLayersLocal(layers);
  }, [layers]);

  const handleOrderChange = (newOrderedItems: IMovableAccordionItem[]) => {
    onChangeLayerOrder(newOrderedItems.map((item) => item.key as string));
  };

  const handleChangeLayerName = (layerId: string, name: string) => {
    onChangeLayerMetadata(layerId, name);
    setEditTitle(null);
  };

  const handleChangeLayerConfinement = (layerId: string, confinement: ILayer['confinement']) => {
    onChangeLayerConfinement(layerId, confinement);
  };

  const getActions = (): IMovableAccordionListAction[] | undefined => {
    if (readOnly) {
      return;
    }

    const actions: IMovableAccordionListAction[] = [
      {text: 'Clone', icon: 'clone', onClick: (item: IMovableAccordionItem) => onCloneLayer(item.key)},
      {text: 'Rename Item', icon: 'edit', onClick: (item: IMovableAccordionItem) => setEditTitle(item.key)},
    ];

    if (1 < layersLocal.length) {
      actions.push({text: 'Delete', icon: 'remove', onClick: (item: IMovableAccordionItem) => onDeleteLayer(item.key)});
    }

    return actions;
  };

  const movableListItems: IMovableAccordionItem[] = layersLocal.map((layerLocal) => {
    return ({
      key: layerLocal.layer_id,
      title: layerLocal.name,
      content: <LayerDetails
        layer={layerLocal}
        spatialDiscretization={spatialDiscretization}
        onChangeLayerConfinement={handleChangeLayerConfinement}
        onChangeLayerProperty={onChangeLayerProperty}
        fetchLayerPropertyData={fetchLayerPropertyData}
        fetchLayerPropertyImage={fetchLayerPropertyImage}
      />,
      editTitle: editTitle === layerLocal.layer_id,
      onChangeTitle: (newTitle: string) => handleChangeLayerName(layerLocal.layer_id, newTitle),
      isSubmittable: !isEqual(layerLocal, layers.find((l) => l.layer_id === layerLocal.layer_id)),
    });
  });

  return (
    <MovableAccordionList
      items={movableListItems}
      onMovableListChange={handleOrderChange}
      actions={getActions()}
      defaultOpenIndexes={[0]}
    />
  );
};

export default LayersList;
