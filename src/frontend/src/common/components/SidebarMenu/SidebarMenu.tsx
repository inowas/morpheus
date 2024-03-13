import React, {useState} from 'react';

import {ISidebarMenuItem} from './types/SidebarMenu.type';
import {Menu} from 'semantic-ui-react';
import styles from './SidebarMenu.module.less';

interface IProps {
  menuItems: ISidebarMenuItem[];
  onClickCallback?: () => void;
}

const SidebarMenu: React.FC<IProps> = ({menuItems, onClickCallback}) => {
  // handles internal state for the sidebar menu
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={styles.sidebarMenu}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={`${styles.sidebarMenuWrapper} ${isOpen ? styles.open : ''}`}>
        <ul className={styles.sidebarMenuList}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`${styles.item} ${item.isTitle ? styles.title : ''} ${item.isActive ? styles.active : ''} ${item.isDisabled ? styles.disabled : ''}`}
            >
              <Menu.Item
                data-testid={`test-item-${item.slug}`}
                as={item.isTitle ? 'h3' : 'a'}
                className={styles.link}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  }

                  if (onClickCallback) {
                    onClickCallback();
                  }
                }}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.description}>{item.name}</span>
              </Menu.Item>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
