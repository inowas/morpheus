import React, {useEffect} from 'react';
import L from 'leaflet';
import './Legend.less';
import {useMap} from 'react-leaflet';

interface IProps {
  colorbarUrl: string | null;
}

const Legend = ({colorbarUrl}: IProps) => {

  const map = useMap();
  const [legend, setLegend] = React.useState<L.Control>(new L.Control({position: 'bottomright'}));

  useEffect(() => {
    if (map && colorbarUrl) {
      map.removeControl(legend);

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML = '<img src="' + colorbarUrl + '" alt="legend" style="width: 80%; height: auto;">';
        return div;
      };

      legend.addTo(map);
    }
  }, [colorbarUrl]);

  useEffect(() => {
    return () => {
      if (map && legend) {
        map.removeControl(legend);
      }
    };
  }, []);

  return null;
};

export default Legend;
