import React, {ReactNode} from 'react';
import styles from './DataRow.module.less';

interface IProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const DataRow = ({
  children,
  style,
  className,
}: IProps) => {


  return (
    <div className={`${styles.dataRow} ${className ? className : ''}`} style={style}>
      {children}
    </div>
  );
};

export default DataRow;



