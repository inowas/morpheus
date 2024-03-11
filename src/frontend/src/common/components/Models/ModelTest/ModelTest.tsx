import {DataGrid, DataRow} from '../index';
import {Dropdown, Form, Icon, Tab, TabPane, TextArea} from 'semantic-ui-react';
import React, {useState} from 'react';

import {Button} from 'common/components';
import DatePicker from 'react-datepicker';
import UploadFile from 'common/components/UploadFile';
import styles from '../Models.module.less';

const options = [
  {key: '1', text: 'React', value: 'React'},
  {key: '2', text: 'Python', value: 'Python'},
  {key: '3', text: 'Ezousa', value: 'Ezousa'},
  {key: '4', text: 'Simulation', value: 'Simulation'},
  {key: '5', text: 'Data', value: 'Data'},
];
const lengthUnitOptions = [
  {key: '1', text: 'Meter', value: 'Meter'},
  {key: '2', text: 'Foot', value: 'Foot'},
  {key: '3', text: 'Kilometer', value: 'Kilometer'},
  {key: '4', text: 'Mile', value: 'Mile'},
  {key: '5', text: 'Yard', value: 'Yard'},
  {key: '6', text: 'Inch', value: 'Inch'},
];
const timeUnitOptions = [
  {key: '1', text: 'Year', value: 'Year'},
  {key: '2', text: 'Month', value: 'Month'},
  {key: '3', text: 'Day', value: 'Day'},
  {key: '4', text: 'Hour', value: 'Hour'},
  {key: '5', text: 'Minute', value: 'Minute'},
  {key: '6', text: 'Second', value: 'Second'},
];

const ModelTest: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const panes = [
    {menuItem: 'Drow on map', render: () => <TabPane><Button primary={true} size={'small'}>Drow on map</Button></TabPane>},
    {menuItem: 'Upload file', render: () => <TabPane><UploadFile/></TabPane>},
  ];

  const hendleDateChange = (name: string, date: Date) => {
    return 'startDate' === name ? setStartDate(date) : setEndDate(date);
  };

  return (
    <div className={styles.fullHeight}>
      <DataGrid multiColumns={2} style={{alignItems: 'normal'}}>
        <DataRow title={'Create model'}>
          <Form.Field className={styles.field}>
            <label className={'h4'}>Model name<span className="required">*</span></label>
            <input type="text"/>
          </Form.Field>
          <Form.Field className={styles.field}>
            <label className={'h4'}>Model description<span className="required">*</span></label>
            <TextArea type="textarea"/>
          </Form.Field>
          <Form.Field className={styles.field}>
            <label className={'h4'}>Model Keywords</label>
            <Dropdown
              name="selectedKeywords"
              placeholder="Select keywords"
              fluid={true}
              multiple={true}
              selection={true}
              options={options}
            />
          </Form.Field>
          <Form.Field className={styles.field}>
            <h3 className={'h4'}>Model dates<span className="required">*</span></h3>
            <div className={'dateInputWrapper fieldGrid '}>
              <div className="fieldRow">
                <label className="labelSmall">Start date</label>
                <div className={'divider'}>
                  <DatePicker
                    name="startDate"
                    className={'dateInput'}
                    selected={startDate}
                    dateFormat="dd.MM.yyyy"
                    onChange={(date: Date) => hendleDateChange('startDate', date)}
                  />
                  <Icon className={'dateIcon'} name="calendar outline"/>
                </div>
              </div>
              <div className="fieldRow">
                <label className="labelSmall">Date to</label>
                <div className={'divider'}>
                  <DatePicker
                    name="endDate"
                    className={'dateInput'}
                    selected={endDate}
                    dateFormat="dd.MM.yyyy"
                    onChange={(date: Date) => hendleDateChange('endDate', date)}
                  />
                  <Icon className={'dateIcon'} name="calendar outline"/>
                </div>
              </div>
            </div>
          </Form.Field>
          <Form.Field className={styles.field}>
            <h3 className={'h4'}>Model units<span className="required">*</span></h3>
            <div className="fieldGrid">
              <div className="fieldRow">
                <label className="labelSmall">Length unit</label>
                <Dropdown
                  placeholder="meters"
                  selection={true}
                  options={lengthUnitOptions}
                />
              </div>
              <div className="fieldRow">
                <label className="labelSmall">Time unit</label>
                <Dropdown
                  placeholder="days"
                  selection={true}
                  options={timeUnitOptions}
                />
              </div>
            </div>
          </Form.Field>
          <Button primary={true}>Create model</Button>
        </DataRow>
        <DataRow title={'Model geometry'}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'stretch',
            height: '100%',
          }}
          >
            <h2 className="h4">Add model domain</h2>
            <Tab panes={panes} className={'tabs'}/>
          </div>
        </DataRow>
      </DataGrid>
      <div style={{marginTop: 'auto', paddingTop: '20px'}}><span className="required">*</span>Mandatory fields</div>
    </div>
  );
};

export default ModelTest;
