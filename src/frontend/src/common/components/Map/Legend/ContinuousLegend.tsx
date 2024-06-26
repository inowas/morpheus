import React, {useEffect} from 'react';
import L from 'leaflet';
import './Legend.less';
import {useMap} from 'react-leaflet';

interface IProps {
  value: number | null;
  minValue: number;
  maxValue: number;
  numberOfGrades?: number;
  getRgbColor: (value: number) => string;
  direction?: 'horizontal' | 'vertical';
}

const calculateGrades = (numberOfSteps: number, minValue: number, maxValue: number) => {
  const step = (maxValue - minValue) / numberOfSteps;
  const grades = [];
  for (let i = 0; i < numberOfSteps; i++) {
    grades.push(minValue + i * step);
  }
  return grades;
};

const getRelativeValue = (value: number, minValue: number, maxValue: number) => (value - minValue) / (maxValue - minValue);

const Legend = ({value, getRgbColor, minValue, maxValue, numberOfGrades = 25, direction = 'vertical'}: IProps) => {

  const map = useMap();
  const [legend, setLegend] = React.useState<L.Control>(new L.Control({position: 'bottomright'}));

  useEffect(() => {
    if (map) {
      map.removeControl(legend);
      legend.onAdd = () => {

        // here we calculate the grades and colors for the legend
        const grades = calculateGrades(numberOfGrades, minValue, maxValue);
        const colors = grades.map((grade) => getRgbColor(grade));
        const relativePosition = value ? getRelativeValue(value, minValue, maxValue) : null;


        // with these parameters we can create a continuous legend
        // @dmytro: this is your part :)
        const div = L.DomUtil.create('div', 'legend_info legend');
        div.innerHTML = '<h4>Legend</h4>';
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'horizontal' === direction ? 'legend_list_horizontal' : 'legend_list');
        for (let i = 0; i < grades.length; i++) {
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
      setLegend(legend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRgbColor, value, minValue, maxValue, numberOfGrades, direction]);

  useEffect(() => {
    return () => {
      if (map && legend) {
        map.removeControl(legend);
      }
    };
    // eslint-disable-next-line
  }, []);

  return null;
};

export default Legend;
