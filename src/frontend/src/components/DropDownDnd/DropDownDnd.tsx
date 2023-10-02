import React, {SyntheticEvent} from 'react';
import {arrayMove, List} from 'react-movable';
import {Checkbox, Dropdown, Icon} from 'semantic-ui-react';

interface IProps<I> {
  items: I[]
  getId: (item: I) => string | number;
  getLabel: (item: I) => string;
  isChecked: (item: I) => boolean;
  setChecked: (item: I, checked: boolean) => I;
  isOpen: boolean;
  onChange: (item: I[]) => void;
  onClick: (isOpen: boolean) => void;
}

const DropDownDnd = <I extends {}>({
  items,
  getId,
  isChecked,
  setChecked,
  getLabel,
  onChange,
  isOpen,
  onClick,
  ...rest
}: IProps<I>) => {

  const handleClickItem = (id: string | number) => {
    onChange(items.map(item => {
      if (id === getId(item)) {
        return setChecked(item, !isChecked(item));
      }
      return item;
    }));
  };

  const listItems = items.map(item => (
    <Checkbox
      id={getId(item)}
      checked={isChecked(item)}
      label={getLabel(item)}
      data-testid="checkbox"
    >
    </Checkbox>
  ));

  return (
    <div
      style={{
        boxShadow: '0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 18%)',
        display: 'inline-block',
        borderRadius: '25px',
        transition: 'all linear 300ms',
        position: 'relative',
      }}
      className='elementHover'
      {...rest}
    >
      <Icon
        name={isOpen ? 'chevron up' : 'chevron down'}
        style={{fontSize: 9, position: 'absolute', top: 12, right: 10, margin: 0}}
      />
      <Dropdown
        icon='list'
        open={isOpen}
        onClick={() => onClick(!isOpen)}
        data-testid="dropdown-dnd"
        style={{padding: '8px 20px 7px'}}
        type={'dropdown'}
        closeOnChange={false}
        closeOnBlur={false}
        closeOnEscape={false}
      >
        <Dropdown.Menu
          className='arrowForMenu'
        >
          <div
            style={{
              maxWidth: '250px',
              margin: '0px auto',
            }}
            data-testid="dropdown-dnd-list"
          >
            <List
              values={listItems}
              onChange={({oldIndex, newIndex}) => onChange(arrayMove(items, oldIndex, newIndex))}
              renderList={({children, props, isDragged}) => (
                <ul
                  {...props}
                  style={{
                    width: 250,
                    padding: '0px',
                    cursor: isDragged ? 'grabbing' : undefined,
                    height: 300,
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    left: '-195px',
                    top: '10px',
                    zIndex: 99,
                    position: 'absolute',
                    backgroundColor: 'white',
                    boxShadow: '0px 2px 3px 0px rgb(34 36 38 / 15%)',
                    border: '1px solid rgba(34, 36, 38, 0.15)',
                    borderRadius: '0.28571429rem',
                    paddingTop: '5px',
                    margin: 0,
                  }}
                >
                  {children}
                </ul>
              )}
              renderItem={({value, props, isDragged, isSelected}) => {
                return (
                  <li
                    {...props}
                    style={{
                      ...props.style,
                      zIndex: 9999999,
                      padding: '5px',
                      color: '#333',
                      backgroundColor: isDragged || isSelected ? '#EEE' : '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    className='draggedMenuRow'
                    onClick={(event: SyntheticEvent) => {
                      event.stopPropagation();
                      handleClickItem(value.props.id);
                    }}
                    data-testid="dropdown-dnd-list-item"
                  >
                    {value}
                    <div className='draggedMenuItem' data-testid="draggedMenuItem">
                      <svg
                        style={{height: 30, width: 15}}
                        data-movable-handle={true}
                        viewBox="0 0 128 128"
                      >
                        <circle
                          fill="#DADADA"
                          cx="42.983"
                          cy="14.788"
                          r="14.788"
                        ></circle>
                        <circle
                          fill="#DADADA"
                          cx="89.488"
                          cy="14.788"
                          r="14.787"
                        ></circle>
                        <circle
                          fill="#DADADA"
                          cx="42.983"
                          cy="64"
                          r="14.788"
                        ></circle>
                        <circle
                          fill="#DADADA"
                          cx="89.488"
                          cy="64"
                          r="14.787"
                        ></circle>
                        <circle
                          fill="#DADADA"
                          cx="42.983"
                          cy="113.305"
                          r="14.788"
                        ></circle>
                        <circle
                          fill="#DADADA"
                          cx="89.488"
                          cy="113.305"
                          r="14.787"
                        ></circle>
                      </svg>
                    </div>
                  </li>
                );
              }}
            />
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropDownDnd;
