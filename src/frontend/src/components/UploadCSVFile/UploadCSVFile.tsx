import React from 'react';
import {Button, Checkbox, Dropdown, Form, Icon, Table} from 'semantic-ui-react';
import styles from '../Models/Models.module.less';
import {DataGrid, DataRow} from '../Models';


interface IUploadCSVFile {
  onClose?: () => void;
}

const UploadCSVFile = ({onClose}: IUploadCSVFile) => {
  const dateFormatOptions = [
    {key: '1', text: 'YYYY-MM-DD', value: 'YYYY-MM-DD'},
    {key: '2', text: 'MM-DD-YYYY', value: 'MM-DD-YYYY'},
    {key: '3', text: 'DD-MM-YYYY', value: 'DD-MM-YYYY'},
  ];

  const startDateOptions = [{key: '1', text: 'start_date_time', value: 'start_date_time'}];
  const timeStepsOptions = [{key: '1', text: 'ntsp', value: 'ntsp'}];
  const multiplierOptions = [{key: '1', text: 'tsmult', value: 'tsmult'}];
  const steadyStateOptions = [{key: '1', text: 'steady', value: 'steady'}];

  const tableData = [
    {startDate: '2015-01-01', timeSteps: '1.000', multiplier: '1.000', steadyState: 'true'},
    {startDate: '2019-12-31', timeSteps: '1.000', multiplier: '1.000', steadyState: 'false'},
  ];

  return (
    <div className={styles.uploadDataset}>
      <DataRow title={'UPLOAD DATASET'}/>
      <DataRow>
        <DataGrid multiColumns={2} className={styles.dataGrid}>
          <Form.Field>
            <label className="labelSmall">
              <Icon className={'dateIcon'} name="info circle"/>
              Date date
            </label>
            <Dropdown
              id="date-format"
              placeholder="YYYY-MM-DD"
              selection={true}
              options={dateFormatOptions}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              className={styles.checkbox}
              label="First row is header"
              checked={false}
            />
          </Form.Field>
        </DataGrid>
      </DataRow>
      <DataGrid className={styles.grid} multiColumns={4}>
        <Form.Field>
          <label className="labelSmall">
            <Icon className={'dateIcon'} name="info circle"/>
            Start date
          </label>
          <Dropdown
            id="start-date"
            placeholder="Start date"
            selection={true}
            options={startDateOptions}
          />
        </Form.Field>
        <Form.Field>
          <label className="labelSmall">
            <Icon className={'dateIcon'} name="info circle"/>
            Time steps
          </label>
          <Dropdown
            id="time-steps"
            placeholder="Time steps"
            selection={true}
            options={timeStepsOptions}
          />
        </Form.Field>
        <Form.Field>
          <label className="labelSmall">
            <Icon className={'dateIcon'} name="info circle"/>
            Multiplier
          </label>
          <Dropdown
            id="multiplier"
            placeholder="Multiplier"
            selection={true}
            options={multiplierOptions}
          />
        </Form.Field>
        <Form.Field>
          <label className="labelSmall">
            <Icon className={'dateIcon'} name="info circle"/>
            Steady state
          </label>
          <Dropdown
            id="steady-state"
            placeholder="Steady state"
            selection={true}
            options={steadyStateOptions}
          />
        </Form.Field>
      </DataGrid>
      <div className="h-64 w-full rounded-md border mb-4 overflow-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Start date</Table.HeaderCell>
              <Table.HeaderCell>Time steps</Table.HeaderCell>
              <Table.HeaderCell>Multiplier</Table.HeaderCell>
              <Table.HeaderCell>Steady state</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map((data, index) => (
              <Table.Row key={index}>
                <Table.Cell className="font-medium">{data.startDate}</Table.Cell>
                <Table.Cell>{data.timeSteps}</Table.Cell>
                <Table.Cell>{data.multiplier}</Table.Cell>
                <Table.Cell>{data.steadyState}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          className="bg-gray-300 text-black" disabled={true}
          basic={true}
        >
          Apply
        </Button>
        <Button basic={true} onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default UploadCSVFile;
