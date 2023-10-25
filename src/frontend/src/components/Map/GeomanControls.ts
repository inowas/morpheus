import '@geoman-io/leaflet-geoman-free';
import {useEffect, useState} from 'react';
import {useLeafletContext} from '@react-leaflet/core';
import type {LayerGroup} from 'leaflet';
import type {GeomanProps} from './types/type';
import {globalEvents, layerEvents, mapEvents, reference} from './infrastructure';

const GeomanControls = ({
  options = {},
  globalOptions = {},
  pathOptions = {},
  lang = 'en',
  eventDebugFn,
  onMount,
  onUnmount,
  ...handlers
}: GeomanProps): null => {
  const [mounted, setMounted] = useState(false);
  const [handlersRef, setHandlersRef] = useState<Record<string, Function>>(
    'development' === process.env.NODE_ENV ? handlers : {},
  );
  const {map, layerContainer} = useLeafletContext();
  const container = (layerContainer as LayerGroup) || map;

  if (!container) {
    console.warn('[GEOMAN-CONTROLS] No map or container instance found');
    return null;
  }


  // TODO! remove on click event
  map.on('click', (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    console.log(`Clicked at Latitude: ${lat}, Longitude: ${lng}`);
  });
  

  useEffect(() => {
    // add controls
    if (!map.pm.controlsVisible()) {
      map.pm.addControls(options);
      if (onMount) onMount();
      setMounted(true);
    }
    return () => {
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalRemovalMode();
      map.pm.disableGlobalDragMode();
      map.pm.disableGlobalCutMode();
      map.pm.disableGlobalRotateMode();
      map.pm.disableGlobalDragMode();
      map.pm.disableGlobalCutMode();
      if (onUnmount) onUnmount();
      map.pm.removeControls();
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    // set path options
    if (mounted) map.pm.setPathOptions(pathOptions);
  }, [pathOptions, mounted]);

  useEffect(() => {
    // set global options
    if (mounted)
      map.pm.setGlobalOptions({layerGroup: container, ...globalOptions});
  }, [globalOptions, mounted]);

  useEffect(() => {
    // set language
    if (mounted) map.pm.setLang(lang);
  }, [lang, mounted]);

  useEffect(() => {
    // attach and remove event handlers
    if (mounted) {
      const withDebug = Object.fromEntries(
        reference.map((handler) => [handler, handlers[handler] ?? eventDebugFn]),
      );
      const layers = layerContainer
        ? container.getLayers()
        : map.pm.getGeomanLayers();
      layers.forEach((layer) => layerEvents(layer, withDebug, 'on'));

      globalEvents(map, withDebug, 'on');
      mapEvents(map, withDebug, 'on');

      return () => {
        globalEvents(map, withDebug, 'off');
        mapEvents(map, withDebug, 'off');
        layers.forEach((layer) => layerEvents(layer, withDebug, 'off'));
        setHandlersRef(handlers);
      };
    }
  }, [
    mounted,
    'development' === process.env.NODE_ENV
      ? Object.entries(handlers).every(([k, fn]) => handlersRef[k] === fn)
      : true,
  ]);

  return null;
};

export default GeomanControls;
