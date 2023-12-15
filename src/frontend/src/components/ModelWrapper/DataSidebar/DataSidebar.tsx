import React, {ReactNode, useState} from 'react';
import styles from './DataSidebar.module.less';
import {Icon} from 'semantic-ui-react';

interface IProps {
  children: ReactNode;
}

const DataSidebar = ({children}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.dataSidebar} ${isOpen ? '' : styles.dataSidebarClosed}`}
    >
      <button
        className={styles.dataSidebarButton}
        onClick={handleSidebarToggle}
      >
        <Icon name={`${isOpen ? 'angle double left' : 'angle double right'}`}/>
      </button>
      <div className={styles.dataChildren}>
        {children}
      </div>
    </div>
  );
};

export default DataSidebar;



