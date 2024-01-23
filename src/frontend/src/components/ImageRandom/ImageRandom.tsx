import React from 'react';

interface IProps {
  images: string[];
}

const ImageRandom = ({images}: IProps) => {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    }}
    >
      <img
        src={randomImage} alt="Random Image"
      />
    </div>
  );
};

export default ImageRandom;



