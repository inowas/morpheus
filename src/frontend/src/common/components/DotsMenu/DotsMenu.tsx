import {Icon, Popup, SemanticICONS} from 'semantic-ui-react';
import React, {useState} from 'react';

import {Button} from 'common/components';
import styles from './DotsMenu.module.less';

export interface IDotsMenuAction {
  text: string;
  icon?: SemanticICONS;
  onClick: () => void;
}

interface IDotsMenuProps {
  actions: IDotsMenuAction[];
  className?: string;
  style?: React.CSSProperties;
}

const DotsMenu: React.FC<IDotsMenuProps> = ({actions, style, className}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>, action: IDotsMenuAction) => {
    e.stopPropagation();
    action.onClick();
    setIsOpen(false);
  };

  return (
    <Popup
      className={styles.dotsMenuPopup}
      trigger={
        <Button
          className={`${styles.dotsMenuButton} ${className ? className : ''}`}
          icon="ellipsis horizontal"
          onClick={(e: React.MouseEvent<HTMLElement>) => handleToggle(e)}
          style={style}
        />
      }
      hideOnScroll={true}
      on="click"
      position="bottom right"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
    >
      <Popup.Content>
        {actions.map((action, idx) => (
          <Button
            key={idx}
            size="tiny"
            data-variant={action.icon}
            onClick={(e) => handleButtonClick(e, action)}
            className={styles.dotsActiveButton}
          >
            {action.icon && <Icon name={action.icon}/>}
            {action.text}
          </Button>
        ))}
      </Popup.Content>
    </Popup>
  );
};

export default DotsMenu;
