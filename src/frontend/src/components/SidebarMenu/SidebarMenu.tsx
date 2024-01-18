import React from 'react';
import {Menu} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './SidebarMenu.module.less';
import {IMenuItem} from './types/SidebarMenu.type';

interface IProps {
  menuItems: IMenuItem[];
  handleItemClick: (index: number) => void;
}

const SidebarMenu: React.FC<IProps> = ({menuItems, handleItemClick}) => {

  return (
    <div className={`${styles.sidebarMenu}`}>
      <div className={styles.sidebarMenuWrapper}>
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
                onClick={(e) => handleItemClick(index)}
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



