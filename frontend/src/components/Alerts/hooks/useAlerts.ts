import {useState} from 'react';
import {IAlert} from '../Alert.type';

const useAlerts = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  const addAlert = (alert: IAlert) => {
    setAlerts([...alerts, alert]);
  };

  const closeAlert = (uuid: string) => {
    setAlerts(alerts.filter(alert => alert.uuid !== uuid));
  };

  const closeAllAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    clearAlert: closeAlert,
    clearAllAlerts: closeAllAlerts,
  };
};

export default useAlerts;
