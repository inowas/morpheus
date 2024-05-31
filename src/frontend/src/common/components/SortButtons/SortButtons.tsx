import React, {useState} from 'react';
import styles from './SortButtons.module.less';
import {Button} from 'semantic-ui-react';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  name?: string;
  onSort: (direction: 'asc' | 'desc', value?: string) => void;
}

const SortButtons = ({name, style, className, onSort}: IProps) => {
  const [directionSort, setDirectionSort] = useState<'asc' | 'desc'>('desc');

  const handleSort = (direction: 'asc' | 'desc') => {
    setDirectionSort(direction);
    onSort(direction, name);
  };

  return (
    <div className={`${styles.sortButtons} ${className || ''}`} style={style}>
      <Button
        className='iconSort'
        icon='caret down'
        onClick={() => handleSort('desc')}
        style={'desc' === directionSort ? {color: '#009FE3'} : {}}
      />
      <Button
        className='iconSort'
        icon='caret up'
        onClick={() => handleSort('asc')}
        style={'asc' === directionSort ? {color: '#009FE3'} : {}}
      />
    </div>
  );
};

export default SortButtons;

