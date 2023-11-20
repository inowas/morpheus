import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import styles from './Header.module.less';

interface IProps {
  children: ReactNode;
}

const Header = ({children}: IProps) => {

  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  const updateHeaderHeight = () => {
    setHeaderHeight(ref.current?.clientHeight || 0);
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
  }, []);


  return (
    <header
      data-testid={'header'}
      className={styles.header}
      style={{
        paddingTop: headerHeight,
        zIndex: 10,
      }}
    >
      <div
        ref={ref}
        className={styles.headerInner}
      >
        {children}
      </div>
    </header>
  );
};

export default Header;
