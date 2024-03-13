import React, {ReactNode} from 'react';

import styles from './DataGrid.module.less';

interface IProps {
  columns?: number;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const DataGrid = ({columns = 1, children, style, className}: IProps) => {

  const multiClass = 1 < columns ? styles[`dataGridMulti_${columns}`] : '';

  return (
    <div className={`${styles.dataGrid} ${multiClass} ${className ? className : ''}`} style={style}>
      {children}
    </div>
  );
};

export default DataGrid;
