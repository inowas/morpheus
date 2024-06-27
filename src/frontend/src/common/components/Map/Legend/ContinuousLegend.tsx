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

const Legend = ({value, getRgbColor, minValue, maxValue, numberOfGrades = 25, direction = 'vertical'}: IProps) => {

  const map = useMap();
  const [legend, setLegend] = React.useState<L.Control>(new L.Control({position: 'bottomright'}));

  const legendIndicatorPosition = value ? `calc(${value && (value / maxValue) * 100}% - 18px)` : '-10px';

  const isFloat = (n: number) => 0 !== n % 1;

  useEffect(() => {

    if (map) {
      map.removeControl(legend);
      legend.onAdd = () => {

        const grades = calculateGrades(numberOfGrades, minValue, maxValue);
        const colors = grades.map((grade) => getRgbColor(grade));

        const div = L.DomUtil.create('div', 'legend_info legend');
        div.innerHTML = '<h4>Legend</h4>';
        const divInner = document.createElement('div');
        divInner.setAttribute('class', 'horizontal' === direction ? 'legend_inner_horizontal' : 'legend_inner_vertical');
        const divLine = document.createElement('div');

        divLine.setAttribute('class', 'legend_line');
        divLine.setAttribute('style', 'background: linear-gradient(' + ('horizontal' === direction ? 'to right' : 'to bottom') + ', ' + colors.join(', ') + ')');

        const divIndicator = document.createElement('div');
        divIndicator.setAttribute('id', 'legend_indicator');

        divInner.appendChild(divLine);
        divInner.appendChild(divIndicator);

        div.appendChild(divInner);
        return div;
      };

      legend.addTo(map);
      setLegend(legend);
    }
  }, [numberOfGrades, direction, minValue, maxValue]);

  useEffect(() => {
    const indicatorElement = document.getElementById('legend_indicator');
    if (indicatorElement) {
      indicatorElement.setAttribute('class', 'legend_indicator');

      if ('horizontal' === direction) {
        indicatorElement.style.left = legendIndicatorPosition;
      } else {
        indicatorElement.style.top = legendIndicatorPosition;
      }
      indicatorElement.innerHTML = `${null !== value ? (isFloat(value) ? value.toFixed(2) : value) : '0'}`;
    }
  }, [value]);

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
