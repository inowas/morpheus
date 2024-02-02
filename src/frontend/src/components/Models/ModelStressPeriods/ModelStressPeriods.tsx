import React, {useState} from 'react';
import {Button, Modal, UploadCSVFile, UploadFile} from 'components';


const ModelStressPeriods = () => {

  const [popupType, setPopupType] = useState('UploadFile');

  const [openUploadPopup, setOpenUploadPopup] = useState(true);
  const onUploadPopupToggle = (type: string = '') => {
    setPopupType(type);
    setOpenUploadPopup(!openUploadPopup);
  };

  return (
    <>
      <Modal.Modal
        onClose={() => setOpenUploadPopup(false)}
        onOpen={() => setOpenUploadPopup(true)}
        open={openUploadPopup}
        dimmer={'inverted'}
      >
        {'UploadFile' === popupType ?
          <Modal.Content>
            <UploadCSVFile onClose={onUploadPopupToggle}/>
          </Modal.Content>
          :
          <Modal.Content>
            <UploadFile onClose={onUploadPopupToggle}/>
          </Modal.Content>}
      </Modal.Modal>
      <Button primary={true} onClick={() => onUploadPopupToggle('UploadCSVFile')}>Upload CSV File</Button>
      <Button primary={true} onClick={() => onUploadPopupToggle('UploadFile')}>Upload DATASET</Button>
    </>
  );
};

export default ModelStressPeriods;
