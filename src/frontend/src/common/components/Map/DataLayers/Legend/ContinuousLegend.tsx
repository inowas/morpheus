import React, {useEffect} from 'react';
import L from 'leaflet';
import './Legend.less';
import {useMap} from 'react-leaflet';

interface IProps {
  title?: string;
  value: number | null;
  minValue: number;
  maxValue: number;
  numberOfGrades?: number;
  getRgbColor: (value: number, minVal: number, maxVal: number) => string;
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

const ContinuousLegend = ({title, value, getRgbColor, minValue, maxValue, numberOfGrades = 25, direction = 'vertical'}: IProps) => {

  const map = useMap();
  const [legend, setLegend] = React.useState<L.Control>(new L.Control({position: 'bottomright'}));
  const [previousValue, setPreviousValue] = React.useState<number | null>(null);
  const isFloat = (n: number) => 0 !== n % 1;

  const getLegendIndicatorPosition = (value: number | null) => {
    if (value) {
      return `calc(${(value - minValue) / (maxValue - minValue) * 100}% - 18px)`;
    }

    return `calc(${previousValue && (previousValue - minValue) / (maxValue - minValue) * 100}% - 18px)`;
  };

  useEffect(() => {
    if (map) {
      map.removeControl(legend);
      legend.onAdd = () => {

        const grades = calculateGrades(numberOfGrades, minValue, maxValue);
        const colors = grades.map((grade) => getRgbColor(grade, minValue, maxValue));

        const div = L.DomUtil.create('div', 'legend_info legend');
        div.innerHTML = title ? `<h4 style="margin-bottom: 10px">${title}</h4>` : '';

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
        indicatorElement.style.left = getLegendIndicatorPosition(value);
      } else {
        indicatorElement.style.top = getLegendIndicatorPosition(value);
      }
      setPreviousValue(value);
      indicatorElement.style.opacity = `${null !== value ? '1' : '0'}`;
      indicatorElement.innerHTML = `${null !== value ? (isFloat(value) ? value.toFixed(2) : value) : ''}`;
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

export default ContinuousLegend;
