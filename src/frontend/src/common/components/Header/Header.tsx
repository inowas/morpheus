import React, {useState} from 'react';

import {ContentWrapper} from 'common/components';
import AvatarButton from './AvatarButton/AvatarButton';
import LanguageSelector from './LanguageSelector/LanguageSelector';
import {Menu} from 'semantic-ui-react';
import logoTUDresden from './images/logo-tud.svg';
import styles from './Header.module.less';


type ILanguageCode = 'de-DE' | 'en-GB';

interface IProps {
  style?: React.CSSProperties;
  language?: ILanguageCode;
  languageList?: {
    code: ILanguageCode;
    label: string;
  }[]
  onChangeLanguage?: (language: ILanguageCode) => void;
  navigateTo: (path: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onLogin?: () => void;
}

const Header = ({
  language,
  languageList,
  onChangeLanguage,
  navigateTo,
  isAuthenticated,
  onLogout,
  onLogin,
}: IProps) => {
  const [showAvatar, setShowAvatar] = useState(false);

  const toggleAvatar = () => {
    setShowAvatar(!showAvatar);
  };

  return (
    <div
      className={styles.header}
      data-testid={'test-header'}
    >
      <ContentWrapper>
        <div className={styles.inner}>
          <Menu.Item
            data-testid={'test-logo'}
            as="a"
            className={styles.logo}
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('/');
            }}
          >
            <img
              className={styles.logo}
              src={logoTUDresden}
              alt={'logo'}
            />
          </Menu.Item>
          <Menu
            className={styles.menu}
            secondary={true}
            position="right"
          >
            {showAvatar ?
              <div className={styles.itemLogin}>
                <AvatarButton
                  image={'https://www.gravatar.com/avatar/4d94d3e077d7b5f527ac629be4800130/?s=80'}
                />
              </div>
              :
              <div className={styles.itemLogin}>
                <Menu.Item
                  name={isAuthenticated ? 'Logout' : 'Login'}
                  as="a"
                  className={styles.item}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated && onLogout) {
                      onLogout();
                    }
                    if (!isAuthenticated && onLogin) {
                      onLogin();
                    }
                    toggleAvatar();
                  }}
                />
              </div>
            }
            {language && languageList && onChangeLanguage && (
              <LanguageSelector
                language={language}
                languageList={languageList}
                onChangeLanguage={onChangeLanguage}
              />
            )}
          </Menu>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Header;
