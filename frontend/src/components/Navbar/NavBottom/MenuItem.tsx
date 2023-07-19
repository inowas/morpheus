import {IDropdownItem, IMenuItem} from '../types/navbar.type';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NavLink} from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';
import styles from './NavBottom.module.less';
import Dropdown from './Dropdown';
import {useNavBottomContext} from './NavBottom';

interface ListItemProps {
  items: IMenuItem | IDropdownItem;
  depthLevel: number
}

const MenuItem: React.FC<ListItemProps> = ({items, depthLevel}) => {
  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const {handleCloseMobileMenu} = useNavBottomContext();
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

  const onSetDropdown = useCallback((value: boolean) => {
    setDropdown(value);
  }, [setDropdown]);


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
      handleCloseMobileMenu();
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
        <NavLink
          to={items.to}
          className={(navData) => navData.isActive ? styles.active : ''}
          onClick={() => closeMobile()}
        >{items.label}</NavLink>
      )}

      {isDropdownItem(items) && (
        <>
          <NavLink
            to={items.basepath}
            aria-expanded={dropdown ? 'true' : 'false'}
            aria-haspopup="menu"
            className={(navData) => navData.isActive ? styles.active : ''}
            onClick={() => closeMobile()}
          >{items.label}</NavLink>
          {isMobile && <button
            type="button"
            aria-label="Togle menu"
            className={`${styles.btnDropdown} ${dropdown ? styles.active : ''}`}
            onClick={() => onSetDropdown(!dropdown)}
          >
            <span aria-hidden="true" className={styles.icon}></span>
          </button>}
          <Dropdown
            dropdown={dropdown}
            submenus={items.subMenu}
            depthLevel={depthLevel}
          />
        </>
      )}
    </li>

  );
};

export default MenuItem;
