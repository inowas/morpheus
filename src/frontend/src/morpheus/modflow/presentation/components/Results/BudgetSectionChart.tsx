import React, {useMemo} from 'react';
import {DataGrid, Form, Label} from 'common/components';
import {CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'common/components/RechartsWrapper';
import {IBudgetData} from '../../../application/useCalculationResults';
import {Bar, BarChart, Cell} from 'recharts';
import {Checkbox, List, Segment} from 'semantic-ui-react';


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

const isValidBudgetBarChartKey = (key: string) => {
  if ('PERCENT_DISCREPANCY' === key) {
    return false;
  }
  return /^[A-Z_]*$/.test(key);
};

const BudgetChart = ({data, isIncremental, onChangeIsIncremental, colors}: IProps) => {

  const [disabledItems, setDisabledItems] = React.useState<string[]>([]);

  const barChartData: IBarChartData = useMemo(() => {
    const dataKeys = Object.keys(data.data).filter((key) => isValidBudgetBarChartKey(key));
    dataKeys.sort();
    return dataKeys.map((key, idx) => ({
      name: key,
      value: data.data[key],
      isDisabled: disabledItems.includes(key),
      position: idx,
      color: colors[idx % colors.length],
    }));
  }, [data.data, disabledItems]);

  const percentDiscrepancy: number | null = useMemo(() => {
    if (!('PERCENT_DISCREPANCY' in data.data)) {
      return null;
    }

    return data.data.PERCENT_DISCREPANCY;
  }, [data.data]);


  return (
    <DataGrid>
      <Form.Form style={{margin: 10}}>
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

      <ResponsiveContainer aspect={16 / 9}>
        <BarChart data={barChartData.filter(item => !item.isDisabled)}>
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

      <Segment color={'grey'}>
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
      </Segment>

    </DataGrid>
  );
};

export default BudgetChart;
