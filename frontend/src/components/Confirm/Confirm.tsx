import React from 'react';
import {Confirm as SemanticConfirm, ConfirmProps} from 'semantic-ui-react';

export type IConfirmProps = {
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
  onCancel?: (event: React.MouseEvent<HTMLAnchorElement>, data: ConfirmProps) => void;
  onConfirm?: (event: React.MouseEvent<HTMLAnchorElement>, data: ConfirmProps) => void;
  confirmButton?: string;
  cancelButton?: string;
};

export type IConfirm = {
  callback: (item?: any) => void;
  confirmationText: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

const Confirm: React.FC<IConfirmProps> = (props) => (
  <SemanticConfirm {...props} />
);

export default Confirm;
