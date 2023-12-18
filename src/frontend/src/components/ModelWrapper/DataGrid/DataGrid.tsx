import React, {ReactNode} from 'react';
import styles from './DataGrid.module.less';

interface IProps {
  multiRows?: boolean;
  children: ReactNode;
}

const DataGrid = ({multiRows = false, children}: IProps) => {
  return (
    <div className={`${styles.dataGrid} ${multiRows ? styles.dataGridMulti : ''}`}>
      {children}
    </div>
  );
};

export default DataGrid;



