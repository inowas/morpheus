import {Header, Image} from 'semantic-ui-react';
import React, {useState} from 'react';

import ImageModal from './ImageModal';

interface IProp {
  imageUrl?: string;
  text?: string;
  color?: string;
  placeHolderImage?: string;
}

const HeaderImage = ({text = '', color = 'orange', placeHolderImage, imageUrl}: IProp) => {
  const [open, setOpen] = useState<boolean>(false);
  const renderImage = () => {
    if (imageUrl) {
      return (
        <Image
          style={{borderRadius: '50%', width: '150px', height: '150px'}}
          size="medium"
          centered={true}
          src={imageUrl}
        />
      );
    }

    return (
      <Image
        data-testid="defaultImage"
        style={{transition: 'all 300ms linear'}}
        size="medium"
        circular={true}
        src={placeHolderImage}
        className='headerImageHover'
      />
    );
  };

  return (
    <div>
      <div
        className='headerImageOnScroll__backgroundImage'
        style={{
          transition: 'all 300ms linear',
          position: 'absolute',
          width: 580,
          height: 260,
          top: '0',
          left: '0',
          background: '#626268',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(20px) brightness(50%)',
          backgroundImage: `url(${imageUrl || placeHolderImage})`,
        }}
      />
      <div
        className='headerImageOnScroll__image' style={{
          transition: 'all 300ms linear',
          border: `4px solid ${color || ''}`,
          borderRadius: '50%',
          width: '160px',
          height: '160px',
          position: 'relative',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 50,
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <div style={{border: '3px solid transparent', overflow: 'hidden', borderRadius: '50%'}}>
          {renderImage()}
        </div>
      </div>
      <Header
        className='headerImageOnScroll__header'
        data-testid="title"
        size="large"
        inverted={true}
        textAlign="center"
        content={text}
        style={{
          transition: 'all 300ms linear',
          position: 'relative',
          textTransform: 'none',
          fontWeight: 'bold',
          marginBottom: '20px',
          fontSize: 20,
        }}
      />
      <ImageModal
        open={open}
        onClose={setOpen}
        url={imageUrl ? imageUrl : placeHolderImage || ''}
      />
    </div>
  );
};

export default HeaderImage;

