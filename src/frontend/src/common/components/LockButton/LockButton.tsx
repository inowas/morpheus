import React, {ReactNode} from 'react';
import styles from './LockButton.module.less';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faUnlock} from '@fortawesome/free-solid-svg-icons';

interface IProps {
  title?: string | ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  locked: boolean;
}

const LockButton = ({
  title,
  onClick,
  locked,
  disabled,
  style,
}: IProps) => {

  return (
    <button
      style={style}
      disabled={disabled}
      className={`${styles.lockButton} lockButton`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={locked ? faLock : faUnlock}/>
      {title}
    </button>
  );
};

export default LockButton;


