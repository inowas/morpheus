import React from 'react';
import {Tab as SemanticTab, TabPane} from 'semantic-ui-react';
import styles from './TabButtons.module.less';
import Button from '../Button/Button';

export interface IButtonPane {
  title: string;
  onClick: () => void;
  content: React.ReactNode;
  disabled?: boolean;
}

export type ITabButtonsProps = {
  panes: IButtonPane[];
  activeIndex?: number;
  isReadOnly?: boolean;
};

const TabButtons = ({panes, activeIndex, isReadOnly}: ITabButtonsProps) => {

  return (
    <SemanticTab
      activeIndex={activeIndex}
      menu={{secondary: true}}
      renderActiveOnly={true}
      panes={panes.map((pane) => ({
        menuItem: <Button
          content={pane.title}
          onClick={pane.onClick}
          disabled={pane.disabled}
          className={styles.button}
        />,
        disabled: isReadOnly || pane.disabled,
        render: () => pane.content,
      }))}
    />
  );
};

export default TabButtons;
