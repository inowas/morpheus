import {Icon, Popup} from 'semantic-ui-react';
import React from 'react';
import styles from './InfoTitle.module.less';

interface IAction {
  actionText: string;
  actionDescription?: string;
  onClick?: () => void;
}

interface IProps {
  title: string;
  description?: string;
  actions?: IAction[];
  secondary?: boolean;
}

const InfoTitle = ({title, description, actions, secondary}: IProps) => {
  return (
    <div data-testid="info-title" className={styles.infoTitle}>
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
      {!actions ? null : (<div className={styles.actions}>
        {actions.map((action, index) => (
          <Popup
            key={index}
            trigger={action.onClick ?
              <button onClick={action.onClick}><Icon className={'dateIcon'} name="info circle"/>{action.actionText}</button> :
              <span><Icon className={'dateIcon'} name="info circle"/>{action.actionText}</span>}
            content={action.actionDescription}
            hideOnScroll={true}
            size="tiny"
          />
        ))}
      </div>)}
    </div>
  );
};

export default InfoTitle;
