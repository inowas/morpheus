import {Tab as SemanticTab, TabProps} from 'semantic-ui-react';

import React from 'react';

export type ITabProps = {
  activeIndex?: number | string;
  className?: string;
  defaultActiveIndex?: number | string;
  menu?: any;
  grid?: { rows: number; columns: number };
  menuPosition?: 'left' | 'right';
  onTabChange?: (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => void;
  panes?: any;
  renderActiveOnly?: boolean;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | null;
  title?: boolean;
};

const Tab: React.FC<ITabProps> = ({
  variant,
  title,
  className: customClassName,
  onTabChange,
  ...props
}) => {
  const classNames = title ? 'first-item-title' : '';

  return (
    <SemanticTab
      {...props}
      onClick={(event: React.MouseEvent<HTMLDivElement>, data: TabProps) => {
        if (onTabChange) {
          onTabChange(event, data);
        }
      }}
      {...(null !== variant ? {'data-variant': variant} : {})}
      className={`${classNames}${customClassName ? ` ${customClassName}` : ''}`}
    />
  );
};

export default Tab;
