import React from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {INotification} from './Notifications.type';

interface IProps {
  notifications: INotification[];
  onClear: (id: string) => void;
  translate: (key: string, options?: any) => string;
}

const Notifications = ({notifications, onClear, translate}: IProps) => {

  const renderAlert = (message: INotification) => {
    if ('success' === message.type) {
      return (
        <Message
          key={message.uuid}
          data-testid="success-alert"
          positive={true}
        >
          <Message.Header>{translate('success_header')}</Message.Header>
          <Icon
            name="close"
            data-testid="close-alert"
            className={'searchInputCloseIcon'}
            onClick={() => onClear(message.uuid)}
          />
          {message.messages.map((item, idx) => (
            <p key={idx}>{translate(item, message.args || {})}</p>
          ))}
        </Message>
      );
    }

    if ('error' === message.type) {
      return (
        <Message
          key={message.uuid}
          data-testid="error-alert"
          negative={true}
        >
          <Message.Header>{translate('error_header')}</Message.Header>
          <Icon
            name="close"
            data-testid="close-alert"
            className={'searchInputCloseIcon'}
            onClick={() => onClear(message.uuid)}
          />
          <ul>
            {translate('error')}:{message.messages.map((item, idx) => <li key={idx} style={{margin: '10px 10px'}}>{translate(item)}</li>)}
          </ul>
        </Message>
      );
    }

    return (
      <Message
        key={message.uuid}
        data-testid="info-alert-type"
      >
        <Message.Header>{translate('unknown_alert_type')}</Message.Header>
        <Icon
          name="close"
          data-testid="close-alert"
          className={'searchInputCloseIcon'}
          onClick={() => onClear(message.uuid)}
        />
        {message.messages.map((item, idx) => (
          <p key={idx}>{translate(item, message.args || {})}</p>
        ))}
      </Message>
    );
  };

  if (0 === notifications.length) {
    return null;
  }

  return (
    <div
      style={{position: 'absolute', bottom: 40, left: 40, zIndex: 10000, width: '30%'}}
      data-testid="alerts"
    >
      {(notifications.map(alert => renderAlert(alert)))}
    </div>
  );
};

export default Notifications;
