import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import 'leaflet-smooth-wheel-zoom';

import './icons.less';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-icon-2x.png';

export {L};
export type {LatLngExpression, LatLngTuple, LeafletEventHandlerFnMap} from 'leaflet';
