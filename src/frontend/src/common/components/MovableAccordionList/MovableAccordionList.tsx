import {Accordion, Icon} from 'semantic-ui-react';
import {arrayMove, List} from 'react-movable';
import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {DotsMenu, IAction} from '../index';
import styles from './MovableAccordionList.module.less';

interface ListItem {
  key: number | string;
  title: {
    content: React.ReactNode;
    icon: boolean;
  };
  content: {
    content: React.ReactNode;
  };
}

interface MovableAccordionListProps {
  items: ListItem[];
  renameItems?: boolean;
  onMovableListChange: (newItems: ListItem[]) => void;
  defaultOpenIndexes?: number[];
  openEachOnClick?: boolean;
}

const MovableAccordionList: React.FC<MovableAccordionListProps> = ({
  items,
  onMovableListChange,
  openEachOnClick = false,
  defaultOpenIndexes = [],
  renameItems = true,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpenIndexes);
  const [openEditingTitle, setOpenEditingTitle] = useState<number | string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSaveTitle = (key: string | number, newTitle: string) => {
    if (!newTitle) {
      setOpenEditingTitle(null);
      return;
    }
    const newItems = items.map((item) =>
      item.key === key
        ? {...item, title: {content: newTitle, icon: false}}
        : item,
    );
    onMovableListChange(newItems);
    setInputValue('');
    setOpenEditingTitle(null);
  };

  const handleDeleteItem = (key: string | number) => {
    if (!key) {
      setOpenEditingTitle(null);
      return;
    }
    const newItems = items.filter((item) => (item.key !== key));
    onMovableListChange(newItems);
    setOpenEditingTitle(null);
  };

  const handleCloneItem = (key: number | string) => {
    if (!key) {
      setOpenEditingTitle(null);
      return;
    }

    const newItems = items.map((item) => {
      if (item.key === key) {
        const clonedItem = {...item, key: uuidv4()};
        return [item, clonedItem];
      }
      return [item];
    }).flat();

    onMovableListChange(newItems);
    setOpenEditingTitle(null);
  };

  const handleAccordionClick = (index: number | undefined) => {
    if (index === undefined) {
      return;
    }

    const newOpenIndexes = openIndexes.includes(index)
      ? openIndexes.filter((item) => item !== index)
      : (openEachOnClick ? [...openIndexes, index] : [index]);

    setOpenIndexes(newOpenIndexes);
  };

  return (
    <div className={'movableList'}>
      <List
        values={items.map((item) => ({
          content: [item],
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
                  color: openEditingTitle === value.content[0].key ? '#009FE3' : '#fff',
                  backgroundColor: '#002557',
                }}
              />
              {renameItems && openEditingTitle === value.content[0].key && (
                <div className={styles.renameField}>
                  <input
                    type='text'
                    value={inputValue}
                    placeholder={String(value.content[0].title.content)}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setInputValue(newTitle);
                    }}
                  />
                  <button onClick={() => handleSaveTitle(value.content[0].key, inputValue)}>
                    Apply
                  </button>
                </div>
              )}
              <DotsMenu
                actions={[
                  {text: 'Clone', icon: 'clone', onClick: () => handleCloneItem(value.content[0].key)},
                  {text: 'Delete', icon: 'remove', onClick: () => handleDeleteItem(value.content[0].key)},
                  renameItems && {text: 'Rename Item', icon: 'edit', onClick: () => setOpenEditingTitle(value.content[0].key)},
                ].filter(action => false !== action) as IAction[]}
                style={{
                  cursor: 'move',
                  position: 'absolute',
                  zIndex: 9999999,
                  right: 40,
                  top: 5,
                  display: 'block',
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
  );
};

export default MovableAccordionList;
