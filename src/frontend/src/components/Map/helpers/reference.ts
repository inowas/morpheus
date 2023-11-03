import type {GeomanHandlers} from '../types/type'

export const reference = [
  'onMapRemove',
  'onLayerRemove',
  'onMapCut',
  'onLayerCut',
  'onMapRotateEnable',
  'onLayerRotateEnable',
  'onMapRotateDisable',
  'onLayerRotateDisable',
  'onMapRotateStart',
  'onLayerRotateStart',
  'onMapRotate',
  'onLayerRotate',
  'onMapRotateEnd',
  'onLayerRotateEnd',
  'onGlobalDrawModeToggled',
  'onDrawStart',
  'onDrawEnd',
  'onCreate',
  'onGlobalEditModeToggled',
  'onGlobalDragModeToggled',
  'onGlobalRemovalModeToggled',
  'onGlobalCutModeToggled',
  'onGlobalRotateModeToggled',
  'onLangChange',
  'onButtonClick',
  'onActionClick',
  'onKeyEvent',
  'onSnapDrag',
  'onSnap',
  'onUnsnap',
  'onCenterPlaced',
  'onEdit',
  'onUpdate',
  'onEnable',
  'onDisable',
  'onVertexAdded',
  'onVertexRemoved',
  'onVertexClick',
  'onMarkerDragStart',
  'onMarkerDrag',
  'onMarkerDragEnd',
  'onLayerReset',
  'onIntersect',
  'onChange',
  'onTextChange',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onDragEnable',
  'onDragDisable',
] as (keyof GeomanHandlers)[]
