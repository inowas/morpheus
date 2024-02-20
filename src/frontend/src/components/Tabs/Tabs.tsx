import React from 'react';
import {Tab as SemanticTab, TabProps} from 'semantic-ui-react';

export type ITabProps = {
  activeIndex?: number | string;
  className?: string;
  defaultActiveIndex?: number | string;
  menu?: any;
  menuPosition?: 'left' | 'right';
  onTabChange?: (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => void;
  panes?: any;
  renderActiveOnly?: boolean;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | null
};

const Tab: React.FC<ITabProps> = ({variant, ...props}) => (
  <SemanticTab {...props} {...(null !== variant ? {'data-variant': variant} : {})}/>
);

export default Tab;
