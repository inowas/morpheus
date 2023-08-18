import {Button, Modal} from 'semantic-ui-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  open: boolean;
  onClose: (value: boolean) => void;
  children: React.ReactNode;
}

const ChartModal = ({open, onClose, children}: IProps) => {
  const {t} = useTranslation('System');
  console.log(open);
  return (
    <Modal
      open={open}
      // data-testid="imageModal"
      className="modalMenu"
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={() => onClose(false)}
      style={{inset: 'auto'}}
    >
      <Modal.Content image={true}>
        {children}
      </Modal.Content>
      <Modal.Actions style={{backgroundColor: '#ffffff'}}>
        <Button
          color="grey" style={{color: '#2f353b'}}
          onClick={() => onClose(false)} data-testid="modalButton"
        >
          {t('close').toUpperCase()}
        </Button>
      </Modal.Actions>
    </Modal>);
};

export default ChartModal;
