import {IDropdownItem, IMenuItem} from '../types/navbar.type';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Menu} from 'semantic-ui-react';
import useIsMobile from '../hooks/useIsMobile';
import styles from './NavBottom.module.less';
import Dropdown from './Dropdown';

interface ListItemProps {
  items: IMenuItem | IDropdownItem;
  depthLevel?: number;
  onCloseMobileMenu: () => void;
  pathname: string;
  navigateTo: (path: string) => void;
}

const MenuItem: React.FC<ListItemProps> = ({items, depthLevel = 0, onCloseMobileMenu, pathname, navigateTo}) => {
  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const [dropdown, setDropdown] = useState(false);
  const {isMobile} = useIsMobile(1199);
  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (dropdown && ref.current && !ref.current.contains(event.target as Node) && !isMobile) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdown, isMobile]);

  const currentPathname = pathname;

  const onSetDropdown = useCallback((value: boolean) => {
    setDropdown(value);
  }, [setDropdown]);


  const isActive = (path: string): boolean => {
    return path === currentPathname;
  };

  const onMouseEnter = () => {
    if (!isMobile) {
      onSetDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (!isMobile) {
      onSetDropdown(false);
    }
  };

  const closeDropdown = () => {
    if (dropdown) {
      onSetDropdown(false);
    }
  };

  const closeMobile = () => {
    if (isMobile) {
      if (dropdown) onSetDropdown(false);
      onCloseMobileMenu();
    }
  };

  return (
    <li
      className={styles.menuItem}
      key={items.name}
      data-lvl={depthLevel}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      {isMenuItem(items) && (
        <Menu.Item
          className={isActive(items.to) ? styles.active : ''}
          onClick={() => {
            closeMobile();
            navigateTo(items.to);
          }}
        >{items.label}</Menu.Item>
      )}

      {isDropdownItem(items) && (
        <>
          <Menu.Item
            to={items.basepath}
            aria-expanded={dropdown ? 'true' : 'false'}
            aria-haspopup="menu"
            className={isActive(items.basepath) ? styles.active : ''}
            onClick={() => {
              closeMobile();
              navigateTo(items.basepath);
            }}
          >{items.label}</Menu.Item>
          {isMobile && <button
            type="button"
            aria-label="Togle menu"
            className={`${styles.btnDropdown} ${dropdown ? styles.active : ''}`}
            onClick={() => onSetDropdown(!dropdown)}
          >
            <span aria-hidden="true" className={styles.icon}></span>
          </button>}
          <Dropdown
            pathname={pathname}
            navigateTo={navigateTo}
            dropdown={dropdown}
            submenus={items.subMenu}
            depthLevel={depthLevel}
            onCloseMobileMenu={onCloseMobileMenu}
          />
        </>
      )}
    </li>

  );
};

export default MenuItem;
