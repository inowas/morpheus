import type {FC} from 'react';
import React, {ChangeEvent} from 'react';
import {Icon, Loader, Notification} from '../index';
import type {DropTargetMonitor} from 'react-dnd';
import {useDrop} from 'react-dnd';
import {NativeTypes} from 'react-dnd-html5-backend';

export interface TargetBoxProps {
  allowedMimetypes?: string[];
  logo: string | null;
  onDrop: (item: { files: any[] }) => void;
  onCancel: () => void;
  overlayText: string;
  deleteText: string;
  error: string | null;
}

const TargetBox: FC<TargetBoxProps> = ({allowedMimetypes, onDrop, logo, onCancel, overlayText, deleteText, error}) => {
  const [{canDrop, isOver}, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[] }) {
        if (onDrop) {
          onDrop(item);
          return;
        }
      },
      canDrop(item: any) {
        return true;
      },
      hover(item: any) {
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [onDrop, logo, onCancel, overlayText],
  );

  const chooseImageOnClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files && 0 < event?.target?.files.length) {
      onDrop({files: [event.target.files[0]]});
    }
  };

  const isActive = canDrop && isOver;
  return (
    <>
      <div
        data-testid="LogoDropzone"
        ref={drop} style={{
          width: 125,
          height: 125,
          margin: '0px auto 10px',
          position: 'relative',
        }}
      >
        {logo ? <>
          {isActive && <Loader/>}
          <span className='showLabelOnHover'>
            <input
              data-testid="fileInput"
              type="file"
              onChange={chooseImageOnClick}
              className='inputFileStyles'
              accept={allowedMimetypes ? allowedMimetypes.join(',') : undefined}
            />
            <div
              className={'closeIcon'}
              data-testid="delete_text"
              onClick={onCancel}
            >{deleteText}</div>
            <span className='overlayTextOnImg'>{overlayText}</span>
          </span>
          <img
            className={'hoverLogoItem'}
            style={{
              width: '125px',
              height: '125px',
              display: 'inline-block',
              transition: 'all 300ms linear',
              objectFit: 'contain',
            }}
            src={logo}
            alt='logo'
          />
        </> :
          <>
            {isActive && <Loader/>}
            <span className='showLabelOnHover'>
              <input
                data-testid="fileInput"
                type="file"
                onChange={chooseImageOnClick}
                className='inputFileStyles'
                accept={allowedMimetypes ? allowedMimetypes.join(',') : undefined}
              />
              <span className='overlayTextOnImg'>{overlayText}</span>
            </span>
            <div
              className='hoverLogoItem'
              style={{
                backgroundColor: 'lightgray',
                borderRadius: '50%',
                width: '125px',
                height: '125px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 300ms linear',
              }}
            >
              <Icon name='plus' style={{fontSize: '24px', margin: 0, lineHeight: 1}}/>
            </div>
          </>
        }
      </div>
      <div data-testid="error_message">
        {error && <Notification error={true}><p>{error}</p></Notification>}
      </div>
    </>
  );
};

export default TargetBox;
