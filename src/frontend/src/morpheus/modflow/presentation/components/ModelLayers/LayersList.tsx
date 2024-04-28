import React, {useEffect, useState} from 'react';
import isEqual from 'lodash.isequal';

import {MovableAccordionList, IMovableAccordionItem, IMovableAccordionListAction} from 'common/components';

import LayerDetails from './LayerDetails';
import {ILayer} from '../../../types/Layers.type';

interface IProps {
  layers: ILayer[];
  onCloneLayer: (layerId: ILayer['layer_id']) => void;
  onDeleteLayer: (layerId: ILayer['layer_id']) => void;
  onLayerOrderChange: (newOrderIds: string[]) => void;
  readOnly: boolean;
}

const LayersList = ({layers, onCloneLayer, onDeleteLayer, onLayerOrderChange, readOnly}: IProps) => {

  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [layersLocal, setLayersLocal] = useState<ILayer[]>(layers);

  useEffect(() => {
    setLayersLocal(layers);
  }, [layers]);

  const handleOrderChange = (newOrderedItems: IMovableAccordionItem[]) => {
    onLayerOrderChange(newOrderedItems.map((item) => item.key as string));
  };

  const handleChangeLayer = (layer: ILayer) => {
    setLayersLocal(layersLocal.map((l) => l.layer_id === layer.layer_id ? layer : l));
  };

  const handleChangeTitle = (key: string, newTitle: string) => {
    handleChangeLayer({...layersLocal.find((l) => l.layer_id === key), name: newTitle} as ILayer);
    setEditTitle(null);
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
        onChange={handleChangeLayer}
      />,
      editTitle: editTitle === layerLocal.layer_id,
      onChangeTitle: (newTitle: string) => handleChangeTitle(layerLocal.layer_id, newTitle),
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
