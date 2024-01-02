import React, {ReactNode, useState} from 'react';
import styles from './DataSidebar.module.less';
import {Icon} from 'semantic-ui-react';

interface IProps {
  children: ReactNode;
  showModelSidebar?: boolean;
}

const DataSidebar = ({children, showModelSidebar}: IProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.dataSidebar} ${isOpen ? '' : styles.dataSidebarClosed} ${showModelSidebar ? '' : styles.dataSidebarRef}`}
    >
      <button
        className={styles.dataSidebarButton}
        onClick={handleSidebarToggle}
      >
        <Icon name={`${isOpen ? 'angle double left' : 'angle double right'}`}/>
      </button>
      <div className={styles.dataWrapper}>
        {children}
      </div>
    </div>
  );
};

export default DataSidebar;



