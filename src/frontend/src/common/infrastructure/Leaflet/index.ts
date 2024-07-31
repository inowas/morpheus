import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet-smooth-wheel-zoom';

import './icons.less';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';

import customMarkerIcon from './custom-marker-icon.svg';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: customMarkerIcon,
  iconRetinaUrl: customMarkerIcon,
  iconSize: [10, 10],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [0, 0],
});

export {L};
export type {LatLngExpression, LatLngTuple, LeafletEventHandlerFnMap} from 'leaflet';
