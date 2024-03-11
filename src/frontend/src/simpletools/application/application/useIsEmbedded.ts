import {useEffect, useState} from 'react';

interface IUseIsEmbedded {
  isEmbedded: boolean;
  setIsEmbedded: (isEmbedded: boolean) => void;
}

const useIsEmbedded = (): IUseIsEmbedded => {
  const [isEmbedded, setIsEmbedded] = useState<boolean>(
    'true' === window.sessionStorage.getItem('isEmbedded') || false,
  );

  useEffect(() => {
    window.sessionStorage.setItem('isEmbedded', isEmbedded.toString());
  }, [isEmbedded]);

  return ({
    isEmbedded,
    setIsEmbedded,
  });
};

export default useIsEmbedded;
export type {IUseIsEmbedded};
