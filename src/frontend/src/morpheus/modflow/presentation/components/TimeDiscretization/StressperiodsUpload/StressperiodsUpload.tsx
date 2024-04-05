import React, {useEffect, useState} from 'react';
import {ECsvColumnType, StressperiodsUploadModal, UploadCsvComponent} from './index';
import {Modal} from 'common/components';

interface IProps {
  handleUpload: (data: any) => void;
}

const StressperiodsUpload = ({handleUpload}: IProps) => {

  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<any>(null);

  useEffect(() => {
    setFileName(uploadedData?.name);
  }, [uploadedData]);

  return (
    <>
      <UploadCsvComponent
        fileName={fileName}
        onUpload={setUploadedData}
      />
      <Modal.Modal
        open={!!uploadedData}
        onClose={() => setUploadedData(null)}
        dimmer={'inverted'}
      >
        <Modal.Content>
          <StressperiodsUploadModal
            data={uploadedData}
            columns={[
              {key: 0, value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME},
              {key: 1, value: 'nstp', text: 'Time steps'},
              {key: 2, value: 'tsmult', text: 'Multiplier'},
              {key: 3, value: 'steady', text: 'Steady state', type: ECsvColumnType.BOOLEAN},
            ]}
            onSave={setUploadedData}
            onCancel={() => {
              setFileName(null);
              setUploadedData(null);
            }}
          />
        </Modal.Content>
      </Modal.Modal>
      {/*<Modal.Modal*/}
      {/*  open={openConfirmationModal}*/}
      {/*  onOpen={() => setOpenConfirmationModal(true)}*/}
      {/*  onClose={() => setOpenConfirmationModal(false)}*/}
      {/*  dimmer={'inverted'}*/}
      {/*>*/}
      {/*  <Modal.Content>*/}
      {/*    <StressperiodsConfirmModal*/}
      {/*      title={'Warning: Data already exists. Overwrite?'}*/}
      {/*      isOpen={false}*/}
      {/*      onClose={() => {*/}
      {/*      }}*/}
      {/*      onSubmit={() => {*/}
      {/*      }}*/}
      {/*      onCansel={() => {*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Modal.Content>*/}
      {/*</Modal.Modal>*/}
    </>
  );
};


export default StressperiodsUpload;
