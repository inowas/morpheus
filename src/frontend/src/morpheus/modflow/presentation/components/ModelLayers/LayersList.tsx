import {ILayer} from '../../../types/Layers.type';
import {MovableAccordionList} from 'common/components';
import React, {useEffect, useState} from 'react';
import {IAction, IMovableAccordionItem} from 'common/components/MovableAccordionList/MovableAccordionList';
import LayerDetails from './LayerDetails';
import isEqual from 'lodash/isEqual';


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

  const actions: IAction[] = [
    {text: 'Clone', icon: 'clone', onClick: (item: IMovableAccordionItem) => console.log('Clone action', item)},
    {text: 'Delete', icon: 'remove', onClick: (item: IMovableAccordionItem) => console.log('Delete action', item)},
    {text: 'Rename Item', icon: 'edit', onClick: (item: IMovableAccordionItem) => setEditTitle(item.key)},
  ];

  const handleChangeTitle = (key: string, newTitle: string) => {
    setLayersLocal(layersLocal.map((layer) => layer.layer_id === key ? {...layer, name: newTitle} : layer));
    setEditTitle(null);
  };

  const movableListItems: IMovableAccordionItem[] = layersLocal.map((layerLocal) => ({
    key: layerLocal.layer_id,
    title: layerLocal.name,
    content: <LayerDetails layer={layerLocal}/>,
    editTitle: editTitle === layerLocal.layer_id,
    onChangeTitle: (newTitle: string) => handleChangeTitle(layerLocal.layer_id, newTitle),
    submittable: !isEqual(layerLocal, layers.find((l) => l.layer_id === layerLocal.layer_id)),
  }));

  return (
    <MovableAccordionList
      items={movableListItems}
      onMovableListChange={handleOrderChange}
      actions={actions}
    />
  );
};

export default LayersList;
