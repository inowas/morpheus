import React, {useState} from 'react';
import {Button, Icon, Popup} from 'semantic-ui-react';
import styles from './DotsMenu.module.less';
import {IAction} from './index';

interface DotsMenuProps {
  actions: IAction[];
}

const DotsMenu: React.FC<DotsMenuProps> = ({actions}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>, action: IAction) => {
    e.stopPropagation();
    console.log(`Clicked on ${action.text}`);
    action.onClick();
    setIsOpen(false);
  };

  return (
    <Popup
      className={styles.dotsPopup}
      trigger={<Button
        className={styles.dotsMenuButton}
        icon="ellipsis horizontal"
        onClick={(e: React.MouseEvent<HTMLElement>) => handleToggle(e)}
      />}
      on="click"
      position="bottom right"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
    >
      <Popup.Content>
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={(e) => handleButtonClick(e, action)}
            className={styles.dotsActiveButton}
          >
            <Icon name={action.icon}/>
            {action.text}
          </button>
        ))}
      </Popup.Content>
    </Popup>
  );
};

export default DotsMenu;
