import React, {useEffect} from 'react';
import L from 'leaflet';
import './Legend.less';
import {useMap} from 'react-leaflet';

interface IProps {
  value: number | null;
  getRgbColor: (value: number) => string;
  grades: number[];
  direction?: 'horizontal' | 'vertical';
}

const Legend = ({value, getRgbColor, grades, direction = 'vertical'}: IProps) => {

  const map = useMap();
  const [legend, setLegend] = React.useState<L.Control>(new L.Control({position: 'bottomright'}));

  useEffect(() => {
    if (map) {
      map.removeControl(legend);
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend_info legend');
        div.innerHTML = '<h4>Legend</h4>';
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'horizontal' === direction ? 'legend_list_horizontal' : 'legend_list');
        for (var i = 0; i < grades.length; i++) {
          const li = document.createElement('li');
          li.setAttribute('class', 'legend_item');
          if (value === grades[i]) {
            li.classList.add('active'); // Add highlighted class if value matches grade
          }
          const currentColor = getRgbColor(grades[i]);
          // Use next color or current color if it's the last item
          const nextColor = getRgbColor(grades[i + 1] || grades[i] + 1);
          li.innerHTML = `<span>${grades[i]}</span> <i style="background: linear-gradient(${'horizontal' === direction ? 'to right' : 'to bottom'}, ${currentColor}, ${nextColor})"></i>`;
          ul.appendChild(li);
        }

        div.appendChild(ul);
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
