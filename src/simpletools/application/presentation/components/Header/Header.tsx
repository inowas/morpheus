import React, {ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import styles from './Header.module.less';
import {useNavigate} from 'react-router-dom';
import useNavbarItems from '../../../application/useNavbarItems';

interface IProps {
  children: ReactNode;
}

const Header = ({children}: IProps) => {
  const navigateTo = useNavigate();
  const {navbarItems} = useNavbarItems();

  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrolled = Math.abs(currentScrollPos - prevScrollPos);

      setVisible(200 > currentScrollPos || prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  useEffect(() => {
    setHeaderHeight(ref.current?.clientHeight || 0);
  }, []);

  return (
    <header
      className={styles.header}
      data-height={headerHeight}
      style={{
        paddingTop: headerHeight,
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
