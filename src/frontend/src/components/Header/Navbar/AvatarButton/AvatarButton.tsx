import {Dropdown, Image} from 'semantic-ui-react';

import React from 'react';
import styles from './AvatarButton.module.less';

interface IProps {
  title?: string;
  image: string;
}

const options = [
  {key: 'user', text: 'Account', icon: 'user'},
  {key: 'settings', text: 'Settings', icon: 'settings'},
  {key: 'sign-out', text: 'Sign Out', icon: 'sign out'},
];
const AvatarButton = (props: IProps) => {

  const trigger = (
    <span className={styles.avatarButtonTrigger}>
      <Image
        avatar={true}
        src={props.image}
        alt={props.title}
      />
    </span>
  );


  return (<Dropdown
    data-testid="avatar-button"
    className={styles.avatarButton}
    trigger={trigger}
    options={options}
    pointing="top right"
    icon={null}
  />);
};


export default AvatarButton;
