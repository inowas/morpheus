import {SemanticShorthandContent, SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';

import {ModalActionsProps} from 'semantic-ui-react/dist/commonjs/modules/Modal/ModalActions';
import {ModalDimmerProps} from 'semantic-ui-react/dist/commonjs/modules/Modal/ModalDimmer';
import {ModalHeaderProps} from 'semantic-ui-react/dist/commonjs/modules/Modal/ModalHeader';
import {ModalProps} from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import React from 'react';
import {Modal as SemanticModal} from 'semantic-ui-react';

export type IModalProps = {
  as?: any;
  basic?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
  className?: string;
  closeIcon?: boolean;
  closeOnDimmerClick?: boolean;
  closeOnDocumentClick?: boolean;
  closeOnEscape?: boolean;
  closeOnPortalMouseLeave?: boolean;
  closeOnTriggerBlur?: boolean;
  closeOnTriggerClick?: boolean;
  closeOnTriggerMouseLeave?: boolean;
  content?: React.ReactNode;
  defaultOpen?: boolean;
  dimmer?: true | 'blurring' | 'inverted';
  mountNode?: HTMLElement | null;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  onClose?: () => void;
  onMount?: () => void;
  onOpen?: () => void;
  onUnmount?: () => void;
  open?: boolean;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
  style?: React.CSSProperties;
  trigger?: React.ReactNode;
  ref?: React.Ref<any>;
};

const Modal: React.FC<IModalProps> = (props) => (
  <SemanticModal {...props} />
);

export type IActionProps = {
  as?: any;
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
  style?: React.CSSProperties;
};

const Actions: React.FC<IActionProps> = (props) => (
  <SemanticModal.Actions {...props} />
);

export type IContentProps = {
  as?: any;
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
  image?: boolean;
  scrolling?: boolean;
  style?: React.CSSProperties;
};

const Content: React.FC<IContentProps> = (props) => (
  <SemanticModal.Content {...props} />
);

export type IHeaderProps = {
  as?: any;
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
  style?: React.CSSProperties;
};

const Header: React.FC<IHeaderProps> = (props) => (
  <SemanticModal.Header {...props} />
);

export type IDescriptionProps = {
  as?: any
  actions?: SemanticShorthandItem<ModalActionsProps>
  basic?: boolean
  centered?: boolean
  children?: React.ReactNode
  className?: string
  closeIcon?: any
  closeOnDimmerClick?: boolean
  closeOnDocumentClick?: boolean
  content?: SemanticShorthandContent
  defaultOpen?: boolean
  dimmer?: true | 'blurring' | 'inverted' | SemanticShorthandItem<ModalDimmerProps>
  eventPool?: string
  header?: SemanticShorthandItem<ModalHeaderProps>
  mountNode?: any
  onActionClick?: (event: React.MouseEvent<HTMLElement>, data: ModalProps) => void
  onClose?: (event: React.MouseEvent<HTMLElement>, data: ModalProps) => void
  onMount?: (nothing: null, data: ModalProps) => void
  onOpen?: (event: React.MouseEvent<HTMLElement>, data: ModalProps) => void
  onUnmount?: (nothing: null, data: ModalProps) => void
  open?: boolean
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
  style?: React.CSSProperties
  trigger?: React.ReactNode
};

const Description: React.FC<IDescriptionProps> = (props) => (
  <SemanticModal.Description {...props} />
);

export {Actions, Content, Header, Description};

export default Modal;
