import {Background, ChartWrapper, Info, Parameters} from '../components';
import {Dimmer, Loader} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {useCalculateChartData, useCalculateMounding, useNavigate, useShowBreadcrumbs, useTranslate} from '../../application';

import {Breadcrumb} from 'common/components';
import {IT02} from '../../types/T02.type';
import SimpleToolGrid from 'common/components/SimpleToolGrid';
import image from '../images/T02.png';

export const defaults: IT02 = {
  parameters: [{
    decimals: 3,
    id: 'w',
    inputType: 'SLIDER',
    label: '',
    max: 10,
    min: 0,
    name: 'Percolation rate<br/>w (m/d)',
    order: 0,
    stepSize: 0.001,
    type: 'float',
    validMin: (x: number) => 0 <= x,
    value: 0.045,
    parseValue: parseFloat,
  }, {
    decimals: 0,
    id: 'L',
    inputType: 'SLIDER',
    label: '',
    max: 1000,
    min: 10,
    name: 'Basin length<br/>L (m)',
    order: 1,
    stepSize: 1,
    type: 'float',
    validMin: (x: number) => 10 <= x,
    value: 40,
    parseValue: parseFloat,
  }, {
    decimals: 0,
    id: 'W',
    inputType: 'SLIDER',
    label: '',
    max: 100,
    min: 10,
    name: 'Basin width<br/>W (m)',
    order: 2,
    stepSize: 1,
    type: 'float',
    validMin: (x: number) => 10 <= x,
    value: 20,
    parseValue: parseFloat,
  }, {
    decimals: 0,
    id: 'hi',
    inputType: 'SLIDER',
    label: '',
    max: 100,
    min: 0,
    name: 'Initial groundwater Level<br/>h<sub>i</sub> (m)',
    order: 3,
    stepSize: 1,
    type: 'float',
    validMin: (x: number) => 0 <= x,
    value: 35,
    parseValue: parseFloat,
  }, {
    decimals: 3,
    id: 'Sy',
    inputType: 'SLIDER',
    label: '',
    max: 0.5,
    min: 0.01,
    name: 'Specific yield<br/>S<sub>y</sub> (-)',
    order: 4,
    stepSize: 0.001,
    type: 'float',
    validMin: (x: number) => 0.01 <= x,
    validMax: (x: number) => 0.5 >= x,
    value: 0.085,
    parseValue: parseFloat,
  }, {
    decimals: 2,
    id: 'K',
    inputType: 'SLIDER',
    label: '',
    max: 10,
    min: 0.1,
    name: 'Hydraulic conductivity<br/>K (m/d)',
    order: 5,
    stepSize: 0.01,
    type: 'float',
    validMin: (x: number) => 0.1 <= x,
    validMax: (x: number) => 100000 >= x,
    value: 1.83,
    parseValue: parseFloat,
  }, {
    decimals: 1,
    id: 't',
    inputType: 'SLIDER',
    label: '',
    max: 100,
    min: 1,
    name: 'Infiltration time<br/>t (d)',
    order: 6,
    stepSize: 0.1,
    type: 'float',
    validMin: (x: number) => 1 <= x,
    value: 1.5,
    parseValue: parseFloat,
  }],
};

type IParameter = IT02['parameters'][0];
const tool = 'T02';

const T02 = () => {
  const [data, setData] = useState<IT02>(defaults);
  const [loading, setLoading] = useState(false);
  const {calculateChartData} = useCalculateChartData();
  const mounding = useCalculateMounding();
  const [chartData, setChartData] = useState<any>(null);
  const navigateTo = useNavigate();
  const showBreadcrumbs = useShowBreadcrumbs();
  const {translate} = useTranslate();

  useEffect(() => {
    setLoading(true);
    calculateChartData({parameters: data.parameters})
      .then((result) => {
        setChartData(result);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeParameters = (parameters: IParameter[]) => {
    setData((prevState) => ({...prevState, parameters: [...parameters]}));
    setLoading(true);
    calculateChartData({parameters})
      .then((result) => {
        setChartData(result);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setData(defaults);
    setLoading(true);
    calculateChartData({parameters: defaults.parameters})
      .then((result) => {
        setChartData(result);
        setLoading(false);
      });
  };

  const title = `${tool}: ${translate(`${tool}_title`)}`;

  return (
    <div data-testid="t02-container">
      {showBreadcrumbs && <Breadcrumb
        items={[
          {label: translate('tools'), link: '/tools'},
          {label: title},
        ]}
        navigateTo={navigateTo}
      />}
      <SimpleToolGrid rows={2}>
        <Background image={image} title={title}/>
        <div style={{minHeight: 300}}>
          {(loading || !chartData) ?
            <Dimmer active={true} inverted={true}>
              <Loader inverted={true}>Loading</Loader>
            </Dimmer> :
            <ChartWrapper
              data={chartData}
            />
          }
        </div>
        <div>
          <Info parameters={data.parameters} mounding={mounding}/>
        </div>
        <Parameters
          debounce={500}
          parameters={data.parameters}
          onChange={handleChangeParameters}
          onReset={handleReset}
          onMoveSlider={() => setLoading(true)}
        />
      </SimpleToolGrid>
    </div>
  );
};

export default T02;
