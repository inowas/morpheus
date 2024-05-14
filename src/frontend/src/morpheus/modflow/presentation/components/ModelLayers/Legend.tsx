import React, {useEffect} from 'react';
import L from 'leaflet';
import './Legend.less';
import {useMap} from 'react-leaflet';

interface IProps {
  value: number | null;
  getRgbColor: (value: number) => string;
  grades: number[];
}

const Legend = ({value, getRgbColor, grades}: IProps) => {

  const map = useMap();
  const [legend, setLegend] = React.useState<L.Control>(new L.Control({position: 'bottomright'}));

  useEffect(() => {
    if (map) {
      map.removeControl(legend);

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend_info legend');
        div.innerHTML = '<h4>Legend</h4>';
        div.innerHTML += `<p>Value: ${value || 'N/A'}</p>`;
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += '<i style="background:' + getRgbColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] && '&ndash;' + grades[i + 1] + '<br>');
        }
        return div;
      };

      legend.addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, grades]);

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
