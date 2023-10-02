import {Button, Image, Modal} from 'semantic-ui-react';
import React from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  open: boolean;
  onClose: (value: boolean) => void;
  url: string;
}

const ImageModal = ({open, onClose, url}: IProps) => {
  const {t} = useTranslation('System');
  return (
    <Modal
      open={open}
      data-testid="imageModal"
      className="modalMenu"
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={() => onClose(false)}
      style={{inset: 'auto'}}
    >
      <Modal.Content image={true}>
        <Image src={url} centered={true}/>
      </Modal.Content>
      <Modal.Actions style={{backgroundColor: '#ffffff'}}>
        <Button
          color='grey' style={{color: '#2f353b'}}
          onClick={() => onClose(false)} data-testid="modalButton"
        >
          {t('close').toUpperCase()}
        </Button>
      </Modal.Actions>
    </Modal>);
};

export default ImageModal;
