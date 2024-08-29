import styles from './SidebarContent.module.less';
import {Icon} from 'semantic-ui-react';
import React from 'react';

interface IProps {
  maxWidth?: number | string;
  children: React.ReactNode;
}

const SidebarContent = ({maxWidth = 'auto', children}: IProps) => {

  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const handleSidebarToggleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.sidebarAside} ${isOpen ? '' : styles.sidebarAsideClosed}`}
      style={{maxWidth: maxWidth}}
    >
      <button
        className={styles.sidebarAsideButton}
        onClick={handleSidebarToggleClick}
      >
        <Icon name={`${isOpen ? 'angle left' : 'angle right'}`}/>
      </button>
      <div className={styles.sidebarAsideInner}>
        {children}
      </div>
    </div>
  );
};

export default SidebarContent;
