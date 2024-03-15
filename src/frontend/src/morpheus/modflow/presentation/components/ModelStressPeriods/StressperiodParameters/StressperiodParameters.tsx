import {Form, Icon, InputOnChangeData, Popup} from 'semantic-ui-react';
import React, {ChangeEvent, useState} from 'react';

// Todo: remove moment and use date-fns
import moment, {Moment} from 'moment';

import {DataGrid} from 'common/components/DataGrid';
import styles from './StressperiodParameters.module.less';
import {IStressperiodParams} from '../../../../types/TimeDiscretization.type';

interface IProps {
  stressperiodParams: IStressperiodParams
  calculateTotalTime: number | null;
  handleDateChange: (date: Moment | null,
                     name: 'startDate' | 'endDate',) => void;
}

const StressperiodParameters: React.FC<IProps> = ({
  stressperiodParams,
  handleDateChange,
  calculateTotalTime,
}) => {

  const [startDateError, setStartDateError] = useState<boolean>(false);
  const [endDateError, setEndDateError] = useState<boolean>(false);
  const startDate = moment.utc(stressperiodParams.startDate, 'DD.MM.YYYY');
  const endDate = moment.utc(stressperiodParams.endDate, 'DD.MM.YYYY');


  let totalTime = '';


  if (calculateTotalTime) {
    totalTime = 1 < calculateTotalTime ? `${calculateTotalTime} days` : `${calculateTotalTime} day`;
  }

  const handleChangeStartDateTime = (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
    const selectedStartDate = moment(value, 'YYYY-MM-DD');
    if (selectedStartDate.isAfter(endDate)) {
      setStartDateError(true);
    } else {
      setStartDateError(false);
      handleDateChange(selectedStartDate, 'startDate');
    }
  };

  const handleChangeEndDateTime = (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
    const selectedEndDate = moment(value, 'YYYY-MM-DD');
    if (selectedEndDate.isBefore(startDate)) {
      setEndDateError(true);
    } else {
      setEndDateError(false);
      handleDateChange(moment(value), 'endDate');
    }
  };

  return (
    <Form className={styles.stressperiodParameters}>
      <DataGrid columns={4}>
        <Form.Field className={'dateInputWrapper'}>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            Start Date
          </label>
          <Popup
            content="Start date of first stressperiod must be before End date of last stressperiods"
            open={startDateError}
            position="top center"
            trigger={
              <div className={'divider'}>
                <Form.Input
                  className={styles.inputField}
                  type="date"
                  name={'startDate'}
                  value={moment(stressperiodParams.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD')}
                  onChange={(e, {value}) =>
                    handleChangeStartDateTime(e, {value})
                  }
                />
                <Icon className={'dateIcon'} name="calendar outline"/>
              </div>
            }
          />
        </Form.Field>
        <Form.Field className={'dateInputWrapper'}>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            End Date
          </label>
          <Popup
            content="End date must be after the start date"
            open={endDateError}
            position="top center"
            trigger={
              <div className={'divider'}>
                <Form.Input
                  className={styles.inputField}
                  type="date"
                  name={'endDate'}
                  value={moment(stressperiodParams.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD')}
                  onChange={(e, {value}) =>
                    handleChangeEndDateTime(e, {value})
                  }
                />
                <Icon className={'dateIcon'} name="calendar outline"/>
              </div>
            }
          />
        </Form.Field>
        <Form.Field>
          <label className={'labelSmall'} style={{textAlign: 'left', fontWeight: 600}}>
            <Icon className={'dateIcon'} name="info circle"/>
            Time unit
          </label>
          <Form.Input
            className={styles.inputField}
            name="Total unit"
            value={stressperiodParams.timeUnit}
            disabled={true}
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
            value={totalTime}
            disabled={true}
          />
        </Form.Field>
      </DataGrid>
    </Form>
  );
};

export default StressperiodParameters;
