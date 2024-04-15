import {Form, Icon} from 'semantic-ui-react';
import React, {useMemo} from 'react';

import {DataGrid} from 'common/components/DataGrid';
import styles from './TimeDiscretizationGeneralParameters.module.less';
import {ITimeDiscretization, ITimeUnit} from '../../../../types';
import {isValid, parseISO} from 'date-fns';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (data: ITimeDiscretization) => void;
}

const TimeDiscretizationGeneralParameters: React.FC<IProps> = ({timeDiscretization, onChange}) => {

  const handleChangeStartDateTime = (value: string) => {
    const dateValue = parseISO(`${value}T00:00:00Z`);
    if (!isValid(dateValue)) {
      return;
    }
    onChange({...timeDiscretization, start_date_time: dateValue.toISOString()});
  };

  const handleChangeEndDateTime = (value: string) => {
    const dateValue = parseISO(`${value}T00:00:00Z`);
    if (!isValid(dateValue)) {
      return;
    }
    onChange({...timeDiscretization, end_date_time: dateValue.toISOString()});
  };

  const handleChangeTimeUnit = (value: ITimeUnit) => {
    onChange({...timeDiscretization, time_unit: value});
  };

  const timeUnitOptions = [
    {key: ITimeUnit.UNDEFINED, text: 'Undefined', value: 0},
    {key: ITimeUnit.SECONDS, text: 'Seconds', value: 1},
    {key: ITimeUnit.MINUTES, text: 'Minutes', value: 2},
    {key: ITimeUnit.HOURS, text: 'Hours', value: 3},
    {key: ITimeUnit.DAYS, text: 'Days', value: 4},
    {key: ITimeUnit.YEARS, text: 'Years', value: 5},
  ];
  
  const calculatedTotalTime = useMemo(() => {
    const seconds = (parseISO(timeDiscretization.end_date_time).getTime() - parseISO(timeDiscretization.start_date_time).getTime()) / 1000;
    switch (timeDiscretization.time_unit) {
    case ITimeUnit.UNDEFINED:
      return 'undefined';
    case ITimeUnit.SECONDS:
      return seconds;
    case ITimeUnit.MINUTES:
      return seconds / 60;
    case ITimeUnit.HOURS:
      return seconds / 3600;
    case ITimeUnit.DAYS:
      return seconds / 86400;
    case ITimeUnit.YEARS:
      return seconds / 31536000;
    default:
      return 0;
    }
  }, [timeDiscretization.start_date_time, timeDiscretization.end_date_time, timeDiscretization.time_unit]);

  return (
    <Form className={styles.stressperiodParameters}>
      <DataGrid columns={4}>
        <Form.Field className={'dateInputWrapper'}>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            Start Date
          </label>
          <div className={'divider'}>
            <Form.Input
              disabled={true}
              className={styles.inputField}
              type="date"
              name={'startDate'}
              value={parseISO(timeDiscretization.start_date_time).toISOString().split('T')[0]}
              onChange={(_, {value}) => handleChangeStartDateTime(value)}
            />
            <Icon className={'dateIcon'} name="calendar outline"/>
          </div>
        </Form.Field>
        <Form.Field className={'dateInputWrapper'}>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            End Date
          </label>
          <div className={'divider'}>
            <Form.Input
              className={styles.inputField}
              type="date"
              name={'endDate'}
              value={parseISO(timeDiscretization.end_date_time).toISOString().split('T')[0]}
              onChange={(_, {value}) => handleChangeEndDateTime(value)}
            />
            <Icon className={'dateIcon'} name="calendar outline"/>
          </div>
        </Form.Field>
        <Form.Field>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            Time unit
          </label>
          <Form.Dropdown
            className={styles.inputField}
            name="Time unit"
            options={timeUnitOptions}
            value={timeDiscretization.time_unit}
            disabled={true}
            onChange={(e, {value}) => handleChangeTimeUnit(value as ITimeUnit)}
          />
        </Form.Field>
        <Form.Field>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            Total time
          </label>
          <Form.Input
            className={styles.inputField}
            name="Total time"
            value={calculatedTotalTime}
            disabled={true}
          />
        </Form.Field>
      </DataGrid>
    </Form>
  );
};

export default TimeDiscretizationGeneralParameters;
