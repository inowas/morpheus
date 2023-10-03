import React, {useEffect} from 'react';
import {Icon, Message} from 'semantic-ui-react';
import {IAlert} from './Alert.type';

interface IProps {
  alerts: IAlert[];
  onClear: (id: string) => void;
  translate: (key: string, options?: any) => string;
}

interface IIntervalId {
  uuid: string,
  id: ReturnType<typeof setTimeout>,
}

const Alerts = ({alerts, onClear, translate}: IProps) => {

  const intervalIds: IIntervalId[] = [];
  const handleClickCloseAlert = (id: string) => {
    intervalIds.forEach(el => {
      if (el.uuid === id) {
        clearTimeout(el.id);
      }
    });
    onClear(id);
  };

  useEffect(() => {
    alerts.map(message => {
      const id = setTimeout(() => {
        handleClickCloseAlert(message.uuid);
      }, message.delayMs);
      intervalIds.push({uuid: message.uuid, id});
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts]);

  const renderAlert = (alert: IAlert) => {

    if ('success' === alert.type) {
      return (
        <Message
          key={alert.uuid}
          data-testid="success-alert"
          positive={true}
        >
          <Message.Header>{translate('success_header')}</Message.Header>
          <Icon
            name="close"
            data-testid="close-alert"
            onClick={() => handleClickCloseAlert(alert.uuid)}
          />
          {alert.messages.map((message, idx) => (
            <p key={idx}>{translate(message, alert.args || {})}</p>
          ))}
        </Message>
      );
    }

    if ('error' === alert.type) {
      return (
        <Message
          key={alert.uuid}
          data-testid="error-alert"
          negative={true}
        >
          <Message.Header>{translate('error_header')}</Message.Header>
          <Icon
            name="close"
            data-testid="close-alert"
            onClick={() => handleClickCloseAlert(alert.uuid)}
          />
          <ul>
            {translate('error')}:{alert.messages.map((message, idx) => <li key={idx} style={{margin: '10px 10px'}}>{translate(message)}</li>)}
          </ul>
        </Message>
      );
    }

    return (
      <Message
        key={alert.uuid}
        data-testid="info-alert-type"
      >
        <Message.Header>{translate('unknown_alert_type')}</Message.Header>
        <Icon
          name="close"
          data-testid="close-alert"
          onClick={() => handleClickCloseAlert(alert.uuid)}
        />
        {alert.messages.map((message, idx) => (
          <p key={idx}>{translate(message, alert.args || {})}</p>
        ))}
      </Message>
    );
  };

  if (0 === alerts.length) {
    return null;
  }

  return (
    <div
      style={{position: 'absolute', bottom: 40, left: 40, zIndex: 99, width: '30%'}}
      data-testid="alerts"
    >
      {(alerts.map(alert => renderAlert(alert)))}
    </div>
  );
};

export default Alerts;
