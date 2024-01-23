import React, {useEffect, useState} from 'react';

interface IProps {
  images: string[];
}

const ImageRandom = ({images}: IProps) => {
  const [randomImage, setRandomImage] = useState<string>('');

  useEffect(() => {
    const newRandomImage = images[Math.floor(Math.random() * images.length)];
    setRandomImage(newRandomImage);
  }, [images]);

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



