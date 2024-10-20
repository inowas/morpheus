import {Icon, Popup} from 'semantic-ui-react';
import React from 'react';
import styles from './InfoTitle.module.less';
import Button from '../Button/Button';
import {v4 as uuidv4} from 'uuid';

interface IAction {
  actionText: string;
  actionDescription?: string;
  onClick?: () => void;
}

interface IProps {
  style?: React.CSSProperties;
  title: string;
  isLocked?: boolean;
  description?: string;
  actions?: IAction[];
  secondary?: boolean;
}

const InfoTitle = ({title, description, actions, secondary, isLocked, style}: IProps) => {
  return (
    <div
      data-testid="info-title" className={styles.infoTitle}
      style={{...style}}
    >
      {description && (
        <Popup
          trigger={secondary ? <span className={styles.secondary}>{title}</span> : <span><Icon className={'dateIcon'} name="info circle"/> {title}</span>}
          content={description}
          hideOnScroll={true}
          size="tiny"
        />
      )}
      {!description && (
        secondary ? <span className={styles.secondary}>{title}</span> : <span><Icon className={'dateIcon'} name="info circle"/> {title}</span>
      )}
      {!actions ? null : (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            action.actionDescription ? (
              <Popup
                key={uuidv4()}
                trigger={action.onClick ? (
                  <Button disabled={isLocked} onClick={action.onClick}>
                    <Icon className={'dateIcon'} name="info circle"/>{action.actionText}
                  </Button>
                ) : (
                  <span><Icon className={'dateIcon'} name="info circle"/>{action.actionText}</span>
                )}
                content={action.actionDescription}
                hideOnScroll={true}
                size="tiny"
              />
            ) : (
              <div key={uuidv4()}>
                {action.onClick
                  ? <Button disabled={isLocked} onClick={action.onClick}>{action.actionText}</Button>
                  : <span>{action.actionText}</span>}
              </div>
            )
          ))}

        </div>)}
    </div>
  );
};

export default InfoTitle;
