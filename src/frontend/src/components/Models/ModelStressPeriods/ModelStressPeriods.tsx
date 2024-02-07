import React from 'react';
import {ECsvColumnType, UploadCSVFile} from 'components/UploadCSVFile';
import {Accordion} from 'semantic-ui-react';
import {DataGrid, DataRow} from '../index';

const ModelStressPeriods = () => {

  const onSave = (data: any) => {
    console.log('Data was saved: ', data);
  };

  const uploadPanel = () => {
    return (<UploadCSVFile
      onCancel={() => console.log('cancel')}
      onSave={onSave}
      columns={[
        {key: 0, value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME},
        {key: 1, value: 'nstp', text: 'Time steps'},
        {key: 2, value: 'tsmult', text: 'Multiplier'},
        {key: 3, value: 'steady', text: 'Steady state', type: ECsvColumnType.BOOLEAN},
      ]}
    />);
  };

  const panels: any[] = [
    {
      key: 1,
      title: {
        content: 'Stress period',
        icon: false,
      },
      content: {
        content: (
          uploadPanel()
        ),
      },
    },
  ];

  return (
    <DataGrid>
      <DataRow title={'Time discretization'}/>
      <Accordion
        defaultActiveIndex={[0]}
        panels={panels}
        exclusive={false}
      />
    </DataGrid>

  );
};

export default ModelStressPeriods;
