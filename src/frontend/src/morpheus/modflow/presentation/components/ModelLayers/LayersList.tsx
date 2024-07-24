import React, {useEffect, useState} from 'react';
import isEqual from 'lodash.isequal';

import {IMovableAccordionItem, IMovableAccordionListAction, MovableAccordionList} from 'common/components';

import LayerDetails from './LayerDetails';
import {IChangeLayerPropertyValues, ILayer, ILayerProperty} from '../../../types/Layers.type';

interface IProps {
  layers: ILayer[];
  onCloneLayer: (layerId: ILayer['layer_id']) => void;
  onDeleteLayer: (layerId: ILayer['layer_id']) => void;
  onChangeLayerMetadata: (layerId: ILayer['layer_id'], name?: ILayer['name'], description?: ILayer['description']) => void;
  onChangeLayerConfinement: (layerId: ILayer['layer_id'], confinement: ILayer['confinement']) => void;
  onChangeLayerOrder: (newOrderIds: string[]) => void;
  onChangeLayerProperty: (layerId: string, propertyName: ILayerProperty, values: IChangeLayerPropertyValues) => void;
  onSelectLayer: (layerId: string, propertyName?: ILayerProperty) => void;
  readOnly: boolean;
}

const LayersList = ({
  layers,
  onCloneLayer,
  onDeleteLayer,
  onChangeLayerConfinement,
  onChangeLayerMetadata,
  onChangeLayerOrder,
  onChangeLayerProperty,
  onSelectLayer,
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

  const movableListItems: IMovableAccordionItem[] = layersLocal.map((layerLocal, idx) => {
    return ({
      key: layerLocal.layer_id,
      title: layerLocal.name,
      content: <LayerDetails
        layer={layerLocal}
        onChangeLayerConfinement={handleChangeLayerConfinement}
        onChangeLayerProperty={onChangeLayerProperty}
        onSelectLayer={onSelectLayer}
        isTopLayer={0 === idx}
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
