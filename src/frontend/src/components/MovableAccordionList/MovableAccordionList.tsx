import React, {useEffect, useState} from 'react';
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
}

interface MovableAccordionListProps {
  items: ListItem[][];
  onMovableListChange: (newItems: ListItem[][]) => void;
  defaultOpenIndexes?: number[];
}

const MovableAccordionList: React.FC<MovableAccordionListProps> = ({
  items,
  onMovableListChange,
  defaultOpenIndexes = [],
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpenIndexes);

  useEffect(() => {
    setOpenIndexes((prevOpenIndexes) =>
      prevOpenIndexes.map((index) => Math.min(index, items.length - 1)),
    );
  }, [items]);

  const handleAccordionClick = (index: number | undefined) => {
    if (index === undefined) {
      return;
    }
    const newOpenIndexes = openIndexes.includes(index)
      ? openIndexes.filter((item) => item !== index)
      : [...openIndexes, index];
    setOpenIndexes(newOpenIndexes);
  };

  return (
    <div className={`${styles.movableList} movableList`}>
      <List
        values={items.map((item) => ({
          content: item,
        }))}
        onChange={({oldIndex, newIndex}) => {
          const newItems = arrayMove(items, oldIndex, newIndex);
          onMovableListChange(newItems);
          setOpenIndexes((prevOpenIndexes) =>
            prevOpenIndexes.map((index) =>
              newIndex > oldIndex
                ? index === oldIndex
                  ? newIndex
                  : index > oldIndex && index <= newIndex
                    ? index - 1
                    : index
                : index === oldIndex
                  ? newIndex
                  : index >= newIndex && index < oldIndex
                    ? index + 1
                    : index,
            ),
          );
        }}
        renderList={({children, props, isDragged}) => (
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
        )}
        renderItem={({props, value, index}) => {

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
                name="bars"
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
                className="accordionPrimary"
                panels={value.content.map((panel) => ({
                  key: panel.key,
                  title: {
                    content: panel.title.content,
                    icon: panel.title.icon,
                    onClick: () => handleAccordionClick(index),
                  },
                  content: {content: panel.content.content},
                  active: index !== undefined && 0 <= index && openIndexes.includes(index) ? true : false,
                }))}
                exclusive={false}
              />
            </li>

          );

        }}
      />
    </div>
  )
  ;
};

export default MovableAccordionList;
