import {Modal} from 'semantic-ui-react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styles from './ChartModal.module.less';

interface IProps {
  open: boolean;
  onClose: (value: boolean) => void;
  children: React.ReactNode;
}

const ChartModal = ({open, onClose, children}: IProps) => {
  const {t} = useTranslation('System');

  return (
    <Modal
      dimmer={'blurring'}
      size={'fullscreen'}
      style={{inset: 'auto', height: '90%'}}
      open={open}
      data-testid="chartModal"
      className={styles.modalWrapper}
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={() => onClose(false)}

    >
      <Modal.Content className={styles.modalContent}>
        {children}
      </Modal.Content>
      <Modal.Actions
        className={styles.modalActions}
        style={{backgroundColor: 'transparent', padding: 0, border: 0}}
      >
        <button
          className={styles.modalButton}
          onClick={() => onClose(false)} data-testid="modalButton"
        >
          <span></span>
          <span></span>
        </button>
      </Modal.Actions>
    </Modal>);
};

export default ChartModal;
