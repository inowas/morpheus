import {Accordion, Icon, SemanticICONS} from 'semantic-ui-react';
import {arrayMove, List} from 'react-movable';
import React, {useState} from 'react';

import {DotsMenu} from 'common/components';
import styles from './MovableAccordionList.module.less';

export interface IMovableAccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
  editTitle: boolean;
  onChangeTitle: (newTitle: string) => void;
  isSubmittable: boolean;
}

export interface IMovableAccordionListAction {
  text: string;
  icon: SemanticICONS;
  onClick: (item: IMovableAccordionItem) => void;
}

interface IMovableAccordionProps {
  items: IMovableAccordionItem[];
  onMovableListChange: (newItems: IMovableAccordionItem[]) => void;
  defaultOpenIndexes?: number[];
  openEachOnClick?: boolean;
  actions?: IMovableAccordionListAction[];
}

const MovableAccordionList = ({items, actions, onMovableListChange, openEachOnClick = false, defaultOpenIndexes = []}: IMovableAccordionProps) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpenIndexes);
  const [inputValue, setInputValue] = useState<string | null>(null);

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
        values={items.map((item) => ({content: item}))}
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

        renderItem={({props, value, index}) => (
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
                color: value.content.editTitle ? '#009FE3' : '#fff',
                backgroundColor: '@red',
              }}
            />

            {value.content.editTitle && <div className={styles.renameField}>
              <input
                type='text'
                value={inputValue || String(value.content.title)}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setInputValue(newTitle);
                }}
              />
              <button onClick={() => {
                value.content.onChangeTitle(String(inputValue));
                setInputValue(null);
              }}
              >
                Save
              </button>
            </div>}

            {actions && <DotsMenu
              actions={actions.map((action) => ({
                ...action,
                onClick: () => action.onClick(value.content),
              }))}
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
            }

            <Accordion
              style={{backgroundColor: '#eeeeee'}}
              className="accordionPrimary"
              panels={[{
                key: value.content.key,
                title: {
                  content: value.content.title + (value.content.isSubmittable ? ' *' : ''),
                  icon: false,
                  onClick: () => handleAccordionClick(index),
                },
                content: {content: value.content.content},
                active: index !== undefined && 0 <= index && openIndexes.includes(index),
              }]}
              exclusive={false}
            />
          </li>
        )}
      />
    </div>
  );
};

export default MovableAccordionList;
