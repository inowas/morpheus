import {Tab as SemanticTab, TabProps} from 'semantic-ui-react';

import React from 'react';
import {SemanticShorthandItem} from 'semantic-ui-react/dist/commonjs/generic';
import {TabPaneProps} from 'semantic-ui-react/dist/commonjs/modules/Tab/TabPane';

export interface IPane {
  pane?: SemanticShorthandItem<TabPaneProps>;
  menuItem?: any;
  render?: () => React.ReactNode;
  isActive?: boolean;
}

export type ITabProps = {
  activeIndex?: number | string;
  className?: string;
  defaultActiveIndex?: number | string;
  menu?: TabProps['menu'];
  grid?: { rows: number; columns: number };
  menuPosition?: 'left' | 'right';
  onTabChange?: (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => void;
  panes?: IPane[];
  renderActiveOnly?: boolean;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | null;
  title?: boolean;
};

const Tab: React.FC<ITabProps> = ({
  variant,
  title,
  className: customClassName,
  panes,
  ...props
}) => {
  const classNames = title ? 'first-item-title' : '';

  const filteredPanes = panes ? panes.filter((pane) => false !== pane.isActive) : [];

  return (
    <SemanticTab
      panes={filteredPanes}
      className={`${classNames}${customClassName ? ` ${customClassName}` : ''}`}
      {...props}
      {...(null !== variant ? {'data-variant': variant} : {})}
    />
  );
};

export default Tab;
