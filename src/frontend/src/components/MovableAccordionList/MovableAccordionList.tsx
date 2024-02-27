import React from 'react';
import {arrayMove, List} from 'react-movable';
import {Accordion, Icon} from 'semantic-ui-react';
import styles from './MovableAccordionList.module.less';

interface ListItem {
  key: number;
  title: {
    content: React.ReactNode;
    icon: boolean;
  };
  content: {
    content: React.ReactNode;
  };
  isOpen: boolean;
}

interface MovableAccordionListProps {
  items: ListItem[][];
  onMovableListChange: (newItems: ListItem[][]) => void;
}

const MovableAccordionList: React.FC<MovableAccordionListProps> = ({items, onMovableListChange}) => {
  const [listItems, setListItems] = React.useState(
    items.map((item, index) => ({
      content: item,
      isOpen: false,
    })),
  );

  const handleAccordionClick = (index: number | undefined) => {
    if (index === undefined) {
      return;
    }
    setListItems((prevItems) =>
      prevItems.map((item, i) => ({
        ...item,
        isOpen: i === index ? !item.isOpen : item.isOpen,
      })),
    );
  };

  return (
    <div className={`${styles.movableList} movableList`}>
      <List
        values={listItems}
        onChange={({oldIndex, newIndex}) => {
          setListItems((prevItems) =>
            arrayMove(prevItems, oldIndex, newIndex),
          );
          if (onMovableListChange) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            onMovableListChange(newItems);
          }
        }}
        renderList={({children, props, isDragged}) => {
          return (
            <ul
              style={{
                zIndex: 10,
                listStyle: 'none',
                margin: 0,
                padding: 0,
                cursor: isDragged ? 'grabbing' : undefined,
                position: 'relative',
              }}
              {...props}
            >
              {children}
            </ul>
          );
        }}
        renderItem={({props, value, index, isDragged}) => {
          return (
            <li
              {...props}
              className={`${styles.movableItem} movableItem`}
              style={{
                ...props.style,
                zIndex: 99,
                listStyle: 'none',
              }}
            >
              <Icon
                data-movable-handle={true}
                className={styles.movableButton}
                name='bars'
                style={{
                  cursor: 'move',
                  position: 'absolute',
                  zIndex: 9999999,
                  left: 0,
                  display: 'block',
                  height: '30px',
                  width: '30px',
                  marginRight: '12px',
                  padding: '6px',
                  color: '#fff',
                  backgroundColor: '#002557',
                }}
              />
              <Accordion
                style={{
                  backgroundColor: '#eeeeee',
                }}
                className='accordionPrimary'
                panels={[value.content[0]]}
                activeIndex={value.isOpen ? [0] : [-1]}
                onTitleClick={() => {
                  handleAccordionClick(index);
                }}
                exclusive={false}
              />
            </li>
          );
        }}
      />
    </div>
  );
};

export default MovableAccordionList;
