import '@geoman-io/leaflet-geoman-free';

import {globalEvents, layerEvents, mapEvents, reference} from './helpers';
import {useEffect, useState} from 'react';

import type {GeomanProps} from './types/type';
import type {LayerGroup} from 'leaflet';
import {useLeafletContext} from '@react-leaflet/core';

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
  // const [handlersRef, setHandlersRef] = useState<Record<string, Function>>(
  //   'development' === process.env.NODE_ENV ? handlers : {},
  // );
  const {map, layerContainer} = useLeafletContext();
  const container = (layerContainer as LayerGroup) || map;

  useEffect(() => {

    if (!map || !map.pm) {
      console.warn('[GEOMAN-CONTROLS] No map instance found');
      return;
    }

    // add controls
    if (!map.pm.controlsVisible()) {
      map.pm.addControls(options);
      if (onMount) {
        onMount();
      }
      setMounted(true);
    }

    return () => {
      if (!map.pm) {
        return;
      }

      if (map.pm.controlsVisible()) {
        map.pm.removeControls();
      }

      if (map.pm.disableDraw) {
        map.pm.disableDraw();
      }

      if (map.pm.disableGlobalCutMode) {
        map.pm.disableGlobalCutMode();
      }

      if (map.pm.disableGlobalCutMode) {
        map.pm.disableGlobalCutMode();
      }

      if (map.pm.removeControls) {
        map.pm.removeControls();
      }

      if (onUnmount) {
        onUnmount();
      }

      setMounted(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set path options
    if (mounted) map.pm.setPathOptions(pathOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathOptions, mounted]);

  useEffect(() => {
    // set global options
    if (mounted)
      map.pm.setGlobalOptions({layerGroup: container, ...globalOptions});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalOptions, mounted]);

  useEffect(() => {
    // set language
    if (mounted) map.pm.setLang(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, mounted]);

  useEffect(() => {
    // attach and remove event handlers
    if (mounted) {
      const withDebug = Object.fromEntries(
        reference.map((handler) => [handler, (handlers as any)[handler] ?? eventDebugFn]),
      );
      const layers = layerContainer ? container.getLayers() : map.pm.getGeomanLayers();
      layers.forEach((layer) => layerEvents(layer, withDebug, 'on'));

      globalEvents(map, withDebug, 'on');
      mapEvents(map, withDebug, 'on');

      return () => {
        globalEvents(map, withDebug, 'off');
        mapEvents(map, withDebug, 'off');
        layers.forEach((layer) => layerEvents(layer, withDebug, 'off'));
        // setHandlersRef(handlers);
      };
    }
  }, [mounted]);

  if (!container) {
    console.warn('[GEOMAN-CONTROLS] No map or container instance found');
    return null;
  }

  return null;
};

export default GeomanControls;
