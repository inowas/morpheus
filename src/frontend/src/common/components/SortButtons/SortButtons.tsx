import React from 'react';
import styles from './SortButtons.module.less';
import {Button} from 'semantic-ui-react';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  direction: 'asc' | 'desc' | null;
  onClick: (direction: 'asc' | 'desc') => void;
}

const SortButtons = ({style, className, direction, onClick}: IProps) => {
  return (
    <div className={`${styles.sortButtons} ${className || ''}`} style={style}>
      <Button
        className='iconSort'
        icon='caret down'
        onClick={() => onClick('desc')}
        style={'desc' === direction ? {color: '#009FE3'} : {}}
      />
      <Button
        className='iconSort'
        icon='caret up'
        onClick={() => onClick('asc')}
        style={'asc' === direction ? {color: '#009FE3'} : {}}
      />
    </div>
  );
};

export default SortButtons;
