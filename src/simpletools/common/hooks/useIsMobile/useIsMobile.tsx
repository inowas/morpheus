import {useEffect, useState} from 'react';

interface IUseIsMobile {
  isMobile: boolean;
}

const useIsMobile = (): IUseIsMobile => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return {
    isMobile: 1140 >= width,
  };
};

export default useIsMobile;
export type {IUseIsMobile};
