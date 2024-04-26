import React, {useEffect, useState} from 'react';
import isEqual from 'lodash.isequal';

import {MovableAccordionList, IMovableAccordionItem, IMovableAccordionListAction} from 'common/components';

import LayerDetails from './LayerDetails';
import {ILayer} from '../../../types/Layers.type';

interface IProps {
  layers: ILayer[];
  onOrderChange: (newOrderIds: string[]) => void;
}

const LayersList = ({layers, onOrderChange}: IProps) => {

  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [layersLocal, setLayersLocal] = useState<ILayer[]>(layers);

  useEffect(() => {
    setLayersLocal(layers);
  }, [layers]);

  const handleOrderChange = (newOrderedItems: IMovableAccordionItem[]) => {
    onOrderChange(newOrderedItems.map((item) => item.key as string));
  };

  const handleChangeLayer = (layer: ILayer) => {
    setLayersLocal(layersLocal.map((l) => l.layer_id === layer.layer_id ? layer : l));
  };

  const handleChangeTitle = (key: string, newTitle: string) => {
    handleChangeLayer({...layersLocal.find((l) => l.layer_id === key), name: newTitle} as ILayer);
    setEditTitle(null);
  };

  const actions: IMovableAccordionListAction[] = [
    {text: 'Clone', icon: 'clone', onClick: (item: IMovableAccordionItem) => console.log('Clone action', item)},
    {text: 'Delete', icon: 'remove', onClick: (item: IMovableAccordionItem) => console.log('Delete action', item)},
    {text: 'Rename Item', icon: 'edit', onClick: (item: IMovableAccordionItem) => setEditTitle(item.key)},
  ];

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
      actions={actions}
      defaultOpenIndexes={[0]}
    />
  );
};

export default LayersList;
