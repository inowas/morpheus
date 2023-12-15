import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import styles from './Header.module.less';
import {ContentWrapper, IPageWidth} from 'components';

interface IProps {
  children: ReactNode;
  maxWidth?: IPageWidth;
}

const Header = ({children, maxWidth}: IProps) => {

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
        zIndex: 100,
      }}
    >
      <div
        ref={ref}
        className={styles.headerInner}
      >
        <ContentWrapper minHeight={'auto'} maxWidth={maxWidth}>
          {children}
        </ContentWrapper>
      </div>
    </header>
  );
};

export default Header;
