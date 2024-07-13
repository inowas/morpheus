import React, {useMemo} from 'react';
import {DataGrid, Form, Label} from 'common/components';
import {CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'common/components/RechartsWrapper';
import {IBudgetData} from '../../../application/useCalculationResults';
import {Bar, BarChart, Cell, Pie, PieChart} from 'recharts';
import {Checkbox, Header, List, Segment, Tab, TabPane} from 'semantic-ui-react';


interface IProps {
  data: IBudgetData;
  isIncremental: boolean;
  onChangeIsIncremental: (value: boolean) => void;
  colors: string[];
}

type IBarChartData = {
  name: string;
  value: number;
  isDisabled: boolean;
  position: number;
  color: string;
}[];

type IPieChartData = {
  name: string;
  value: number;
  color: string;
}[];


const isValidBudgetChartKey = (key: string) => {
  if ('PERCENT_DISCREPANCY' === key) {
    return false;
  }
  return /^[A-Z_]*$/.test(key);
};

const BudgetChart = ({data, isIncremental, onChangeIsIncremental, colors}: IProps) => {

  const [disabledItems, setDisabledItems] = React.useState<string[]>([]);

  const barChartData: IBarChartData = useMemo(() => {
    const dataKeys = Object.keys(data.data).filter((key) => isValidBudgetChartKey(key));
    dataKeys.sort();
    return dataKeys.map((key, idx) => ({
      name: key,
      value: data.data[key],
      isDisabled: disabledItems.includes(key),
      position: idx,
      color: colors[idx % colors.length],
    }));
  }, [data.data, disabledItems]);


  const pieChartData: [IPieChartData, IPieChartData] = useMemo(() => {
    const dataKeys = Object.keys(data.data).filter((key) => isValidBudgetChartKey(key));
    const inFlowKeys = dataKeys.filter((key) => key.endsWith('_IN') && !key.startsWith('TOTAL'));
    const outFlowKeys = dataKeys.filter((key) => key.endsWith('_OUT') && !key.startsWith('TOTAL'));

    const inFlowData = inFlowKeys.map((key, idx) => ({
      name: key,
      value: data.data[key],
      color: colors[idx % colors.length],
    }));

    const outFlowData = outFlowKeys.map((key, idx) => ({
      name: key,
      value: data.data[key] * -1,
      color: colors[idx % colors.length],
    }));

    return [inFlowData, outFlowData];


  }, [data.data]);

  const percentDiscrepancy: number | null = useMemo(() => {
    if (!('PERCENT_DISCREPANCY' in data.data)) {
      return null;
    }

    return data.data.PERCENT_DISCREPANCY;
  }, [data.data]);

  const renderBarChart = () => (
    <>
      <ResponsiveContainer aspect={16 / 9}>
        <BarChart
          data={barChartData.filter(item => !item.isDisabled)}
          margin={{top: 10, right: 10, left: -10, bottom: 10}}
        >
          <CartesianGrid strokeDasharray='3 3'/>
          <XAxis
            dataKey='name'
            hide={true}
            interval={0}
          />
          <YAxis tickFormatter={(value: number) => value.toExponential()}/>
          <Tooltip/>
          <Bar dataKey='value' fill='#8884d8'>
            {barChartData
              .filter((item) => !item.isDisabled)
              .map((item) => <Cell key={item.position} fill={item.color}/>)
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {null !== percentDiscrepancy && <span style={{textAlign: 'right'}}>{null != percentDiscrepancy && <p>Discrepancy: {percentDiscrepancy.toFixed(2)}%</p>}</span>}

      <List>
        {barChartData.map((item) => (
          <List.Item key={item.name}>
            <List.Content>
              <Form.Group>
                <Checkbox
                  checked={!item.isDisabled}
                  label={item.name}
                  onChange={() => {
                    if (item.isDisabled) {
                      return setDisabledItems(disabledItems.filter((key) => key !== item.name));
                    }
                    setDisabledItems([...disabledItems, item.name]);
                  }}
                />
              </Form.Group>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </>
  );

  const renderPieChart = () => (
    <>
      <Header as={'h3'}>Inflow</Header>
      <ResponsiveContainer aspect={16 / 9}>
        <PieChart
          margin={{top: 10, right: 10, left: -10, bottom: 10}}
          key={'inflow'}
          title={'Inflow'}
        >
          <Pie
            data={pieChartData[0]}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={100}
            fill='#8884d8'
            label={({name, value}) => `${name} (${value.toExponential()})`}
          >
            {pieChartData[0].map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color}/>
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Header as={'h3'}>Outflow</Header>
      <ResponsiveContainer aspect={16 / 9}>
        <PieChart
          margin={{top: 10, right: 10, left: -10, bottom: 10}}
          key={'outflow'}
          title={'Outflow'}
        >
          <Pie
            data={pieChartData[1]}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={100}
            fill='#8884d8'
            label={({name, value}) => `${name} (${value.toExponential()})`}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );


  return (
    <DataGrid>
      <Form.Form style={{margin: 10, marginBottom: 0}}>
        <Form.Group>
          <Label>Type</Label>
          <Form.Radio
            label={'Incremental'}
            checked={isIncremental}
            onChange={(e, {checked}) => onChangeIsIncremental(!!checked)}
          />
          <Form.Radio
            label={'Cumulative'}
            checked={!isIncremental}
            onChange={(e, {checked}) => onChangeIsIncremental(!checked)}
          />
        </Form.Group>
      </Form.Form>

      <Tab
        panes={[
          {menuItem: 'Bars', render: () => <TabPane attached={true}>{renderBarChart()}</TabPane>},
          {menuItem: 'Pies', render: () => <TabPane attached={true}>{renderPieChart()}</TabPane>},
        ]}
      />
    </DataGrid>
  );
};

export default BudgetChart;
