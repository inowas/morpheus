import React, {ReactNode} from 'react';
import styles from './DataGrid.module.less';

interface IProps {
  multiRows?: boolean;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const DataGrid = ({multiRows = false, children, style, className}: IProps) => {
  return (
    <div className={`${styles.dataGrid} ${multiRows ? styles.dataGridMulti : ''}  ${className ? className : ''}`} style={style}>
      {children}
    </div>
  );
};

export default DataGrid;



