import {PopupProps, StrictPopupProps} from 'semantic-ui-react/dist/commonjs/modules/Popup/Popup';

import {PopupContentProps} from 'semantic-ui-react/dist/commonjs/modules/Popup/PopupContent';
import {PopupHeaderProps} from 'semantic-ui-react/dist/commonjs/modules/Popup/PopupHeader';
import React from 'react';
import {Popup as SemanticLabel} from 'semantic-ui-react';
import {SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';
import {StrictPortalProps} from 'semantic-ui-react/dist/commonjs/addons/Portal';

export interface PopupProp extends StrictPopupProps {
  [key: string]: any
}

export interface IPopupProps extends StrictPortalProps {

  as?: any
  basic?: boolean
  children?: React.ReactNode
  className?: string
  content?: SemanticShorthandItem<PopupContentProps>
  context?: Document | Window | HTMLElement | React.RefObject<HTMLElement>
  disabled?: boolean
  eventsEnabled?: boolean
  flowing?: boolean
  header?: SemanticShorthandItem<PopupHeaderProps>
  hideOnScroll?: boolean
  hoverable?: boolean
  inverted?: boolean
  on?: 'hover' | 'click' | 'focus' | ('hover' | 'click' | 'focus')[]
  onClose?: (event: React.MouseEvent<HTMLElement>, data: PopupProps) => void
  onMount?: (nothing: null, data: PopupProps) => void
  onOpen?: (event: React.MouseEvent<HTMLElement>, data: PopupProps) => void
  onUnmount?: (nothing: null, data: PopupProps) => void
  pinned?: boolean
  position?:
    | 'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'top center'
    | 'bottom center'
  positionFixed?: boolean
  popper?: SemanticShorthandItem<React.HTMLAttributes<HTMLDivElement>>
  popperModifiers?: any[]
  popperDependencies?: any[]
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'huge'
  style?: React.CSSProperties
  trigger?: React.ReactNode
  wide?: boolean | 'very'
}

const Popup: React.FC<IPopupProps> = (props) => (
  <SemanticLabel {...props} />
);

export default Popup;
