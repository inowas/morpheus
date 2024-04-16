import {Tab as SemanticTab, TabPane as SemanticTabPane, TabProps} from 'semantic-ui-react';
import React from 'react';

export type ITabProps = {
  activeIndex?: number | string;
  className?: string;
  defaultActiveIndex?: number | string;
  menu?: TabProps['menu'];
  grid?: { rows: number; columns: number };
  menuPosition?: 'left' | 'right';
  onTabChange?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => void;
  panes?: TabProps['panes'];
  renderActiveOnly?: boolean;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | null;
  title?: boolean;
};

type TabComponentProps = ITabProps;

const Tab: React.FC<TabComponentProps> & { TabPane: typeof SemanticTabPane } = ({
  variant,
  title,
  className: customClassName,
  onTabChange,
  ...props
}) => {
  const classNames = title ? 'first-item-title' : '';

  const handleTabChange = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => {
    if (onTabChange) {
      onTabChange(event, data); // Pass the event and data object to the onTabChange function
    }
  };

  return (
    <SemanticTab
      {...props}
      onTabChange={handleTabChange} // Pass the handleTabChange function to the onTabChange prop
      {...(variant ? {'data-variant': variant} : {})}
      className={`${classNames}${customClassName ? ` ${customClassName}` : ''}`}
    />
  );
};

Tab.TabPane = SemanticTabPane;

export default Tab;
