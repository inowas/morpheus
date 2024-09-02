import React, {useMemo} from 'react';
import {DataGrid, Form, Label} from 'common/components';
import {Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'common/components/RechartsWrapper';
import {Message} from 'semantic-ui-react';


interface IProps {
  data: number[][];
  selectedRowAndColumn: { col: number; row: number };
}

const CrossSectionChart = ({data, selectedRowAndColumn}: IProps) => {

  const [selectedDisplayType, setSelectedDisplayType] = React.useState<'A-A' | 'B-B'>('A-A');

  const chartData = useMemo(() => {
    if (!selectedRowAndColumn || !data) {
      return [];
    }

    // Get data for selected row
    if ('A-A' === selectedDisplayType) {
      return data[selectedRowAndColumn.row].map((value, idx) => ({name: idx, value}));
    }

    // Get data for selected column
    return data.map((row, idx) => ({name: idx, value: row[selectedRowAndColumn.col]}));
  }, [data, selectedRowAndColumn, selectedDisplayType]);

  const renderTooltip = () => (e: any) => {
    const value = e.payload && 1 <= e.payload.length ? e.payload[0].payload : { name: '', value: 0 };
    let name = 'Row';

    if ('A-A' === selectedDisplayType) {
      name = 'Column';
    }

    return (
      <Message
        size='tiny' color='black'
        style={{
          opacity: '0.8',
          padding: '6px',
        }}
      >
        <p>
          {name} {value.name}
        </p>
        <Message.Header>{value.value.toFixed(2)}</Message.Header>
      </Message>
    );
  };


  return (
    <DataGrid>
      <Form.Form style={{margin: 10}}>
        <Form.Group>
          <Label>Groundwater piezometric head (m)</Label>
          {/* Todo @dmytro - add styles to dropdown */}
          <Form.Radio
            label={'A-A\''}
            checked={'A-A' === selectedDisplayType}
            onChange={() => setSelectedDisplayType('A-A')}
          />
          <Form.Radio
            label={'B-B\''}
            checked={'B-B' === selectedDisplayType}
            onChange={() => setSelectedDisplayType('B-B')}
          />
        </Form.Group>
      </Form.Form>

      <ResponsiveContainer aspect={16 / 9}>
        <AreaChart
          data={chartData} margin={{top: 0, right: 15, left: -20, bottom: 20}}
          title={'A-A\''}
        >
          <XAxis
            dataKey='name'
            domain={['dataMin', 'dataMax']}
            label={{
              value: {'A-A': 'Column (A-A\')', 'B-B': 'Row (B-B\')'}[selectedDisplayType],
              angle: 0,
              position: 'bottom',
            }}
            axisType={'xAxis'}
            type={'number'}
          />
          <YAxis
            domain={['auto', 'auto']}
            axisType={'yAxis'}
            type={'number'}
          />
          <CartesianGrid strokeDasharray='3 3'/>
          <ReferenceLine
            x={'A-A' === selectedDisplayType ? selectedRowAndColumn.col : selectedRowAndColumn.row}
            stroke='#000'
            strokeOpacity={0.5}
            strokeWidth={5}
            label={{value: {'A-A': 'B', 'B-B': 'A\''}[selectedDisplayType], position: 'insideTopRight', fill: '#000'}}
          />
          <Tooltip content={renderTooltip()} />
          <Area
            type='linear' dataKey='value'
            stroke='#3ac6ff' fill='#3ac6ff'
          />
        </AreaChart>
      </ResponsiveContainer>


    </DataGrid>
  );
};

export default CrossSectionChart;
