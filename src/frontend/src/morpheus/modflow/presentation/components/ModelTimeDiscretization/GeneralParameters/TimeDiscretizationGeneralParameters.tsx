import {Form, Icon} from 'semantic-ui-react';
import React, {useMemo} from 'react';

import {DataGrid} from 'common/components/DataGrid';
import styles from './TimeDiscretizationGeneralParameters.module.less';
import {ITimeDiscretization, ITimeUnit} from '../../../../types';
import {useDateTimeFormat} from 'common/hooks';
import DateInput from '../FormInput/DateInput';

interface IProps {
  timeDiscretization: ITimeDiscretization;
  onChange: (data: ITimeDiscretization) => void;
  timeZone?: string;
  isReadOnly: boolean;
}

const TimeDiscretizationGeneralParameters: React.FC<IProps> = ({timeDiscretization, onChange, timeZone, isReadOnly}) => {

  const {isValid, getUnixTimestamp, formatISODate, parseDate} = useDateTimeFormat(timeZone);

  const handleChangeStartDateTime = (value: string) => {
    if (!isValid(value)) {
      return;
    }
    onChange({...timeDiscretization, start_date_time: value});
  };

  const handleChangeEndDateTime = (value: string) => {
    if (!isValid(value)) {
      return;
    }
    onChange({...timeDiscretization, end_date_time: value});
  };

  const handleChangeTimeUnit = (value: ITimeUnit) => {
    onChange({...timeDiscretization, time_unit: value});
  };

  const timeUnitOptions = [
    {key: ITimeUnit.SECONDS, text: 'Seconds', value: ITimeUnit.SECONDS},
    {key: ITimeUnit.MINUTES, text: 'Minutes', value: ITimeUnit.MINUTES},
    {key: ITimeUnit.HOURS, text: 'Hours', value: ITimeUnit.HOURS},
    {key: ITimeUnit.DAYS, text: 'Days', value: ITimeUnit.DAYS},
    {key: ITimeUnit.YEARS, text: 'Years', value: ITimeUnit.YEARS},
  ];

  const calculatedTotalTime = useMemo(() => {
    const seconds = (getUnixTimestamp(timeDiscretization.end_date_time) - getUnixTimestamp(timeDiscretization.start_date_time)) / 1000;
    switch (timeDiscretization.time_unit) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <DateInput
              value={formatISODate(timeDiscretization.start_date_time)}
              onChange={(value) => handleChangeStartDateTime(parseDate(value))}
              isReadOnly={isReadOnly}
              isValid={(value) => isValid(parseDate(value))}
              isDisabled={true}
            />
          </div>
        </Form.Field>
        <Form.Field className={'dateInputWrapper'}>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            End Date
          </label>
          <div className={'divider'}>
            <DateInput
              value={formatISODate(timeDiscretization.end_date_time)}
              onChange={(value) => handleChangeEndDateTime(parseDate(value))}
              isReadOnly={isReadOnly}
              isValid={(value) => isValid(parseDate(value))}
            />
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
