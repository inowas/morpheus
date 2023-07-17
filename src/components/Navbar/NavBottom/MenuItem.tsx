// import {useEffect, useRef, useState} from 'react';
import {IDropdownItem, IMenuItem} from '../types/navbar.type';
import React, {useState} from 'react';
import styles from './NavBottom.module.less';
import Dropdown from './Dropdown';

interface ListItemProps {
  items: IMenuItem | IDropdownItem;
}

const MenuItem: React.FC<ListItemProps> = ({items}) => {
  // console.log(items);
  // const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;
  const [dropdown, setDropdown] = useState(true);
  // const [dropdown, setDropdown] = useState(false);
  // let ref = useRef();
  // useEffect(() => {
  //   const handler = (event) => {
  //     if (
  //       dropdown &&
  //       ref.current &&
  //       !ref.current.contains(event.target)
  //     ) {
  //       setDropdown(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', handler);
  //   document.addEventListener('touchstart', handler);
  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener('mousedown', handler);
  //     document.removeEventListener('touchstart', handler);
  //   };
  // }, [dropdown]);
  //
  // const onMouseEnter = () => {
  //   960 < window.innerWidth && setDropdown(true);
  // };
  //
  // const onMouseLeave = () => {
  //   960 < window.innerWidth && setDropdown(false);
  // };
  //
  // const closeDropdown = () => {
  //   dropdown && setDropdown(false);
  // };


  return (

    <li className={styles.menuItem} key={items.name}>
      {isDropdownItem(items) ? (
        <>
          {/*{items.basepath && <a href={items.basepath}>{items.name}</a>}*/}
          <button
            type="button"
            aria-expanded={dropdown ? 'true' : 'false'}
            aria-haspopup="menu"
            onClick={() => setDropdown(!dropdown)}
          >
            {items.label}
          </button>
          <Dropdown dropdown={dropdown} submenus={items.subMenu}/>
        </>
      ) : (
        <a href={items.to}>{items.label}</a>
      )}
      {/*    { if (isMenuItem(item)) {*/}
      {/*          return (*/}
      {/*          <li className={styles.menuItems} key={item.name}>*/}
      {/*        <a href={item.to}>{item.name}</a>*/}
      {/*      </li>*/}
      {/*    );*/}
      {/*  }*/}
      {/*if (isDropdownItem(item)) {*/}
      {/*  return (*/}
      {/*    <li className={styles.menuItems} key={item.name}>*/}
      {/*      <a href={item.basepath}>{item.name}</a>*/}
      {/*    </li>*/}
      {/*  );*/}
      {/*}*/}
      {/*return null;*/}
      {/*    }*/}
    </li>

  );
};

export default MenuItem;
