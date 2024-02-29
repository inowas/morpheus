import React, {useState} from 'react';
import {Icon, Popup} from 'semantic-ui-react';
import {Button} from 'components';
import styles from './DotsMenu.module.less';
import {IAction} from './index';

interface DotsMenuProps {
  actions: IAction[];
  style?: React.CSSProperties;
}

const DotsMenu: React.FC<DotsMenuProps> = ({actions, style}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>, action: IAction) => {
    e.stopPropagation();
    action.onClick();
    setIsOpen(false);
  };

  return (
    <Popup
      className={styles.dotsPopup}
      trigger={
        <Button
          className={styles.dotsMenuButton}
          icon="ellipsis horizontal"
          onClick={(e: React.MouseEvent<HTMLElement>) => handleToggle(e)}
          style={style}
        />
      }
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