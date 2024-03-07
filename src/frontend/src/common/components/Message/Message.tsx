import {MessageProps, MessageSizeProp} from 'semantic-ui-react/dist/commonjs/collections/Message/Message';
import {SemanticCOLORS, SemanticShorthandCollection, SemanticShorthandContent, SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';

import {MessageHeaderProps} from 'semantic-ui-react/dist/commonjs/collections/Message/MessageHeader';
import {MessageItemProps} from 'semantic-ui-react/dist/commonjs/collections/Message/MessageItem';
import React from 'react';
import {Message as SemanticMessage} from 'semantic-ui-react';

export type IMessageProps = {
  as?: any
  attached?: boolean | 'bottom' | 'top'
  children?: React.ReactNode
  className?: string
  color?: SemanticCOLORS
  compact?: boolean
  content?: SemanticShorthandContent
  error?: boolean
  floating?: boolean
  header?: SemanticShorthandItem<MessageHeaderProps>
  hidden?: boolean
  icon?: any | boolean
  info?: boolean
  list?: SemanticShorthandCollection<MessageItemProps>
  negative?: boolean
  onDismiss?: (event: React.MouseEvent<HTMLElement>, data: MessageProps) => void
  positive?: boolean
  size?: MessageSizeProp
  success?: boolean
  visible?: boolean
  warning?: boolean
  style?: React.CSSProperties
};

const Message: React.FC<IMessageProps> = (props) => (
  <SemanticMessage {...props} />
);

export default Message;
