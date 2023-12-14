import React, {ReactNode, useState} from 'react';
import styles from './Sidebar.module.less';
import {Icon} from 'semantic-ui-react';
import FormFilter from 'components/FormFilter';
import {IModelCard} from '../ModelCard';

interface IProps {
  children: ReactNode;
  data: IModelCard[];
  updateModelData: (data: IModelCard[]) => void;
}

const Sidebar = ({children, data, updateModelData}: IProps) => {
  const [isOpen, setIsOpen] = useState(true);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleClose = () => {
    if (!isOpen) {
      scrollToTop();
    }
    setIsOpen(!isOpen);
  };


  return (
    <div
      data-testid="sidebar-container"
      className={`${styles.sidebarContainer} ${isOpen ? '' : styles.sidebarClosed}`}

    >
      <button
        className={styles.sidebarStickyButton}
        onClick={handleClose}
      >
        <Icon name="angle double left"/>
      </button>
      <div
        className={styles.sidebarInner}
      >
        <div className={styles.sidebarAside}>
          <aside>
            <div className={styles.wrapper}>
              <FormFilter data={data} updateModelData={updateModelData}/>
            </div>
          </aside>
        </div>
        <div className={styles.sidebarContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


