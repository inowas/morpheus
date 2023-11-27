import React, {useState} from 'react';
import {Menu} from 'semantic-ui-react';
import logoTUDresden from '../images/logo-tud.svg';
import styles from './NavTop.module.less';
import ContentWrapper from 'components/ContentWrapper/ContentWrapper';
import AvatarButton from '../AvatarButton/AvatarButton';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

type ILanguageCode = 'de-DE' | 'en-GB';

interface IProps {
  language?: ILanguageCode;
  languageList?: {
    code: ILanguageCode;
    label: string;
  }[]
  onChangeLanguage?: (language: ILanguageCode) => void;
  navigateTo: (path: string) => void;
}

const NavTop = ({language, languageList, onChangeLanguage, navigateTo}: IProps) => {
  const [showAvatar, setShowAvatar] = useState(false);

  const toggleAvatar = () => {
    setShowAvatar(!showAvatar);
  };

  return (
    <div className={styles.navTop} data-testid={'test-navtop'}>
      <ContentWrapper minHeight={'auto'} maxWidth={1440}>
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
            <Menu.Item
              name="Contact"
              as="a"
              className={styles.item}
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('/contact/');
              }}
            />
            <Menu.Item
              name="Legal Notice"
              as="a"
              className={styles.item}
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('/imprint/');
              }}
            />
            <Menu.Item
              name="Accessibility"
              as="a"
              className={styles.item}
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('/declaration-on-accessibility/');
              }}
            />

            {showAvatar ?
              <div className={styles.itemLogin}>
                <AvatarButton
                  image={'https://www.gravatar.com/avatar/4d94d3e077d7b5f527ac629be4800130/?s=80'}
                />
              </div>
              :
              <div className={styles.itemLogin}>
                <Menu.Item
                  name="Sign in!"
                  as="a"
                  className={styles.item}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('/auth');
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

export default NavTop;
