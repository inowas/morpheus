import React, {useState} from 'react';
import {arrayMove, List} from 'react-movable';
import {Accordion, Icon} from 'semantic-ui-react';
import styles from './MovableList.module.less';

const MovableList = ({items}: any) => {
  const [listItems, setListItems] = useState(items.map((item: any, index: number) => ({
    content: item,
    isOpen: false,
  })));


  return (
    <div className={styles.movableList}>
      <List
        values={listItems}
        onChange={({oldIndex, newIndex}) =>
          setListItems(arrayMove(listItems, oldIndex, newIndex))
        }
        renderList={({children, props, isDragged}) => {
          return (
            <ul
              {...props}
              className={isDragged ? styles.isDragging : ''}
            >{children}
            </ul>);
        }}
        renderItem={({props, value, index, isDragged}) => {
          return (
            <li
              className={`${styles.movableItem}
              ${isDragged ? styles.isDragging : ''}`}
              {...props}
            >
              <Icon
                data-movable-handle={true}
                className={styles.movableButton}
                name='bars'
              />
              <Accordion
                className={`${styles.accordionMovableList} accordionPrimary`}
                panels={[value.content[0]]}
                exclusive={false}
              />
            </li>
          );
        }}
      />
    </div>
  );
};
export default MovableList;
