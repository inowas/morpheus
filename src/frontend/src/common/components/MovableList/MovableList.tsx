import React from 'react';
import {arrayMove, List} from 'react-movable';
import {Icon} from 'semantic-ui-react';
import styles from './MovableList.module.less';

interface MovableListProps<T> {
  items: T[];
  onChange: (newItems: T[]) => void;
  renderListItem: {
    key: string;
    name: string;
    element: React.ReactNode;
  }[];
}

const MovableList: React.FC<MovableListProps<any>> = ({items, onChange, renderListItem}) => {

  return (
    <List
      values={renderListItem.map((item) => ({content: item}))}
      onChange={({oldIndex, newIndex}) => {
        const updatedItems = arrayMove(items, oldIndex, newIndex);
        onChange(updatedItems);
      }}
      renderList={({children, props, isDragged}) => <ul
        {...props}
        className={styles.movableList}
        style={{
          zIndex: 10,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          cursor: isDragged ? 'grabbing' : undefined,
          position: 'relative',
        }}
      >{children}</ul>}
      renderItem={({value, props}) => {
        return (
          <li
            {...props}
            className={styles.movableItem}
            style={{
              ...props.style,
              zIndex: 99,
              listStyle: 'none',
            }}
          >
            <Icon
              data-movable-handle={true}
              className={styles.movableButton}
              name="bars"
              style={{
                display: 'block',
                zIndex: 9999999,
                height: '25px',
                width: '25px',
                backgroundColor: '#002557',
                margin: 0,
              }}
            />
            <div className={styles.movableItemInner}>
              {value.content.element}
            </div>
          </li>
        );
      }

      }
    />
  );
};

export default MovableList;
