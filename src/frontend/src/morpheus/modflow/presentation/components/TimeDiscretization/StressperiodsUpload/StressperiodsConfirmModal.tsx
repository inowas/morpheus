import React from 'react';
import {Button, DataGrid, DataRow, Modal} from 'common/components';
import styles from '../../../../../../common/components/UploadCSVFile/UploadCSVFile.module.less';

const StressperiodsConfirmModal = () => {
  return (
    <Modal.Modal
      // onClose={() => setShowConfirmationModal(false)}
      // onOpen={() => setShowConfirmationModal(true)}
      // open={showConfirmationModal}
      dimmer={'inverted'}
    >
      <Modal.Content>
        <DataGrid>
          <DataRow>
            <h2 style={{color: '#BF1E1E'}}>Warning:</h2>
            <p style={{fontSize: '17px'}}> Data already exists. Overwrite?</p>
          </DataRow>
          <div className={styles.buttonGroup}>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              onClick={() => {
                // setShowConfirmationModal(false);
              }}
            >
              No
            </Button>
            <Button
              style={{
                fontSize: '17px',
                textTransform: 'capitalize',
              }}
              primary={true}
              // onClick={() => resetDataFoo()}
            >
              Yes
            </Button>
          </div>
        </DataGrid>
      </Modal.Content>
    </Modal.Modal>
  );
};


export default StressperiodsConfirmModal;
