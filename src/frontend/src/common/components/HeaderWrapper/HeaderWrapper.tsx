import {ContentWrapper, IPageWidth} from 'common/components';
import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import styles from './HeaderWrapper.module.less';

interface IProps {
  maxWidth?: IPageWidth;
  updateHeight?: (height: number) => void;
  showSidebarMenu?: boolean;
  children: ReactNode;
}

const HeaderWrapper = ({
  maxWidth,
  updateHeight,
  showSidebarMenu = false,
  children,
}: IProps) => {
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
      data-testid={'header'}
      style={{
        paddingTop: headerHeight,
        zIndex: 110,
      }}
    >
      <div
        ref={ref}
        className={styles.headerInner}
      >
        <ContentWrapper
          minHeight={'auto'}
          maxWidth={maxWidth}
          showSidebarMenu={showSidebarMenu}
        >
          {children}
        </ContentWrapper>
      </div>
    </header>
  );
};

export default HeaderWrapper;
