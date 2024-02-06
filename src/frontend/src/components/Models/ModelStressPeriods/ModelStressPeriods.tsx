import React from 'react';
import {ECsvColumnType, UploadCSVFile} from 'components/UploadCSVFile';

const ModelStressPeriods = () => {

  const onSave = (data: any) => {
    console.log('Data was saved: ', data);
  };

  return (
    <>
      <UploadCSVFile
        onCancel={() => console.log('cancel')}
        onSave={onSave}
        columns={[
          {key: 0, value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME},
          {key: 1, value: 'nstp', text: 'Time steps'},
          {key: 2, value: 'tsmult', text: 'Multiplier'},
          {key: 3, value: 'steady', text: 'Steady state', type: ECsvColumnType.BOOLEAN},
        ]}
      />
    </>
  );
};

export default ModelStressPeriods;
