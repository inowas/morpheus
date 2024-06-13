import React, {createRef} from 'react';
import {Button} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import styles from './AssetButtonsGroup.module.less';

interface IProps {
  acceptFiles?: string;
  buttonContent?: string;
  checkedAssets?: string[];
  className?: string;
  isReadOnly: boolean;
  loading: boolean;
  onDelete?: () => void;
  onDownload?: () => void;
  onSelectFiles?: (files: File[]) => void;
  style?: React.CSSProperties;
}

const AssetButtonsGroup = ({
  style,
  acceptFiles,
  buttonContent,
  className,
  loading,
  isReadOnly,
  onSelectFiles,
  onDownload,
  onDelete,
  checkedAssets,
}: IProps) => {

  const fileInputRef = createRef<HTMLInputElement>();


  if (isReadOnly) {
    return null;
  }

  const renderUploadButton = () => {
    if (onSelectFiles) {
      return (
        <>
          <Button
            primary={true}
            size={'small'}
            content={buttonContent || 'Upload file'}
            onClick={() => fileInputRef.current?.click()}
            disabled={isReadOnly || loading}
            style={{fontSize: '17px'}}
          />
          <input
            ref={fileInputRef}
            type={'file'}
            multiple={true}
            hidden={true}
            onChange={async (e) => {
              const files = e.target.files;
              if (files) {
                onSelectFiles(Array.from(files));
                e.target.value = '';
              }
            }}
            accept={acceptFiles}
            disabled={isReadOnly}
          />
        </>
      );
    }
  };

  return (
    <div className={`${className || ''} ${styles.assetButtonsGroup}`} style={style}>
      {renderUploadButton()}
      {(onDelete || onDownload) && <div style={{marginLeft: 'auto'}}>
        {onDelete && <Button
          className='buttonLink'
          disabled={isReadOnly || loading || null === checkedAssets}
          onClick={onDelete}
        >
          Delete selected
          <FontAwesomeIcon icon={faTrashCan}/>
        </Button>}
        {onDownload && <Button
          className='buttonLink'
          disabled={isReadOnly || loading || null === checkedAssets}
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



