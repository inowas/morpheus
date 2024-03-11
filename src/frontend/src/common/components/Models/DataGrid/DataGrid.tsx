import React, {ReactNode} from 'react';

import styles from './DataGrid.module.less';

interface IProps {
  multiColumns?: number;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const DataGrid = ({multiColumns = 1, children, style, className}: IProps) => {

  const multiClass = 1 < multiColumns ? styles[`dataGridMulti_${multiColumns}`] : '';

  return (
    <div className={`${styles.dataGrid} ${multiClass} ${className ? className : ''}`} style={style}>
      {children}
    </div>
  );
};

export default DataGrid;



