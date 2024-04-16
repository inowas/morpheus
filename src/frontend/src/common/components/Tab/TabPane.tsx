import {TabPane as SemanticTabPane} from 'semantic-ui-react';

import React from 'react';

type ITabPaneProps = {
  as?: any;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
  loading?: boolean;
  [key: string]: any;
};

const TabPane: React.FC<ITabPaneProps> = ({...props}) => (
  <SemanticTabPane {...props}/>
);

export default TabPane;
export type {ITabPaneProps};
