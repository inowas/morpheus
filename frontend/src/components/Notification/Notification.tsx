import React from 'react';
import {Message as SemanticMessage} from 'semantic-ui-react';

export type INotificationProps = {
  children?: React.ReactNode;
  warning?: boolean;
  error?: boolean;
  success?: boolean;
  style?: React.CSSProperties;
  content?: string;
};

const Notification: React.FC<INotificationProps> = (props) => (
  <SemanticMessage {...props}/>
);

export default Notification;
