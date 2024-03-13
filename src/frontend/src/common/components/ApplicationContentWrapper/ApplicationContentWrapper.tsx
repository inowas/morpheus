import {IMenuItem, SidebarMenu} from 'common/components/SidebarMenu';
import React, {ReactNode, useState} from 'react';

import {Icon} from 'semantic-ui-react';
import styles from './ApplicationContentWrapper.module.less';

interface IProps {
  children: ReactNode;
  headerHeight?: number;
  open?: boolean;
  maxWidth?: number;
  contentFullWidth?: boolean;
  menuItems?: IMenuItem[];
  handleItemClick?: (index: number) => void;
}

const ApplicationContentWrapper = ({children, headerHeight, open = false, maxWidth = 700, contentFullWidth = false, menuItems, handleItemClick}: IProps) => {
  const sidebarChildren = React.Children.toArray(children);
  const [isOpen, setIsOpen] = useState(open);
  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSidebarOpen = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div
      style={{height: `calc(100vh - ${headerHeight}px)`}}
      className={styles.wrapper}
    >
      {(menuItems && handleItemClick) && <SidebarMenu
        menuItems={menuItems} handleItemClick={handleItemClick}
        openDataSidebar={handleSidebarOpen}
      />}
      <div className={styles.mainContentWrapper}>
        {sidebarChildren.map((component, index) => {
          if (0 === index && React.isValidElement(component)) {
            return (
              <div
                key={index}
                className={`${styles.sidebarAside} ${isOpen ? '' : styles.sidebarAsideClosed}`}
                style={{maxWidth: maxWidth}}
              >
                <button
                  className={styles.sidebarAsideButton}
                  onClick={handleSidebarToggle}
                >
                  <Icon name={`${isOpen ? 'angle double left' : 'angle double right'}`}/>
                </button>
                <div className={styles.sidebarAsideInner}>
                  {component}
                </div>
              </div>
            );
          } else if (1 === index && React.isValidElement(component)) {
            return (
              <div key={index} className={`${styles.sidebarContent} ${contentFullWidth ? styles.sidebarContentFullWidth : ''}`}>
                {component}
              </div>
            );
          }
          return null; // Ignore other types or invalid elements
        })}
      </div>
    </div>
  );
};

export default ApplicationContentWrapper;


