import React from 'react';
import {Button} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import styles from './AssetButtonsGroup.module.less';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  isReadOnly: boolean;
  loading: boolean;
  onUploadFile?: (value: boolean) => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

const AssetButtonsGroup = ({
  style,
  className,
  loading,
  isReadOnly,
  onUploadFile,
  onDownload,
  onDelete,
}: IProps) => {

  if (isReadOnly) {
    return null;
  }

  return (
    <div className={`${className || ''} ${styles.assetButtonsGroup}`} style={style}>
      {onUploadFile && <Button
        primary={true}
        size={'small'}
        content={'Upload new file'}
        onClick={() => onUploadFile(true)}
        disabled={isReadOnly || loading}
        style={{fontSize: '17px'}}
      />}
      {(onDelete || onDownload) && <div style={{marginLeft: 'auto'}}>
        {onDelete && <Button
          className='buttonLink'
          disabled={isReadOnly || loading}
          onClick={onDelete}
        >
          Delete selected
          <FontAwesomeIcon icon={faTrashCan}/>
        </Button>}
        {onDownload && <Button
          className='buttonLink'
          disabled={isReadOnly || loading}
          onClick={onDownload}
        >
          Download selected
          <FontAwesomeIcon icon={faDownload}/>
        </Button>}
      </div>}
    </div>
  );
};

export default AssetButtonsGroup;



