import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import styles from './HeaderWrapper.module.less';

interface IProps {
  updateHeight?: (height: number) => void;
  children: ReactNode;
}

const HeaderWrapper = ({updateHeight, children}: IProps) => {
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [headerHeight, setHeaderHeight] = useState(ref.current?.clientHeight || 0);

  const updateHeaderHeight = () => {
    if (ref.current) {
      const height = ref.current.clientHeight;
      setHeaderHeight(height);
      if (updateHeight) {
        updateHeight(height); // Notify the parent about the updated height
      }
    }
  };

  useEffect(() => {
    updateHeaderHeight(); // Set initial header height
    const handleResize = () => {
      updateHeaderHeight(); // Update header height when window resizes
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup the event listener
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={styles.header}
      data-testid={'test-headerWrapper'}
      style={{
        paddingTop: headerHeight,
      }}
    >
      <div ref={ref} className={styles.headerInner}>
        {children}
      </div>
    </header>
  );
};

export default HeaderWrapper;
