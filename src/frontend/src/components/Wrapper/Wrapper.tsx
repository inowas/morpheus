import React, {ReactNode} from 'react';
import styles from './Wrapper.module.less';

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({children, className}) => {
  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {children}
    </div>
  );
};

export default Wrapper;
