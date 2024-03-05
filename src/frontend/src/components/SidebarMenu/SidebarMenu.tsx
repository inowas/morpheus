import React, {useState} from 'react';
import {Menu} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './SidebarMenu.module.less';
import {IMenuItem} from './types/SidebarMenu.type';

interface IProps {
  menuItems: IMenuItem[];
  handleItemClick: (index: number) => void;
  openDataSidebar?: () => void;
}

const SidebarMenu: React.FC<IProps> = ({menuItems, handleItemClick, openDataSidebar}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const itemClick = (index: number) => {
    handleItemClick(index);
    if (openDataSidebar) openDataSidebar();
    closeSidebar();
  };

  return (
    <div
      className={styles.sidebarMenu}
      onMouseEnter={() => openSidebar()}
      onMouseLeave={() => closeSidebar()}
    >
      <div className={`${styles.sidebarMenuWrapper} ${isSidebarOpen ? styles.open : ''}`}>
        <ul className={styles.sidebarMenuList}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`${styles.item} ${item.title ? styles.title : ''} ${item.active ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
            >
              <Menu.Item
                data-testid={`test-item-${item.description.toLowerCase().replace(/ /g, '-')}`}
                as={item.title ? 'h3' : 'a'}
                className={styles.link}
                onClick={() => itemClick(index)}
              >
                <span className={styles.icon}><FontAwesomeIcon icon={item.icon}/></span>
                <span className={styles.description}>{item.description}</span>
              </Menu.Item>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default SidebarMenu;



