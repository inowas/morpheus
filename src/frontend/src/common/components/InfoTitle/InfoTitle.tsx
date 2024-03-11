import {Icon, Popup} from 'semantic-ui-react';

import React from 'react';
import styles from './InfoTitle.module.less';

interface IProps {
  title: string;
  description?: string;
  actionText?: string;
  actionDescription?: string;
  onAction?: () => void;
}

const InfoTitle = ({title, description, actionText, actionDescription, onAction}: IProps) => {


  const renderAction = () => {
    return (
      <>
        {actionDescription && actionText && onAction ? (
          <Popup
            trigger={
              <button onClick={onAction}>
                <Icon className={'dateIcon'} name="info circle"/> {actionText}
              </button>
            }
            content={actionDescription}
            hideOnScroll={true}
            size="tiny"
          />
        ) : (
          <button onClick={onAction}>
            <Icon className={'dateIcon'} name="info circle"/> {actionText}
          </button>
        )}
      </>
    );
  };


  return (
    <div
      data-testid="info-title"
      className={styles.infoTitle}
    >
      {description ? (
        <Popup
          trigger={
            <span>
              <Icon className={'dateIcon'} name="info circle"/> {title}
            </span>
          }
          content={description}
          hideOnScroll={true}
          size="tiny"
        />
      ) : (
        <span>
          <Icon className={'dateIcon'} name="info circle"/> {title}
        </span>
      )}
      {actionText && onAction && renderAction()}
    </div>
  );
};

export default InfoTitle;


