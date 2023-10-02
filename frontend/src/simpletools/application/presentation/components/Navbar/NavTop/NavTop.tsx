import React from 'react';
import {Container, Menu} from 'semantic-ui-react';
import logoTUDresden from '../images/logo-tud.svg';
import styles from './NavTop.module.less';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

type ILanguageCode = 'de-DE' | 'en-GB';

interface IProps {
  language: ILanguageCode;
  languageList: {
    code: ILanguageCode;
    label: string;
  }[]
  onChangeLanguage: (language: ILanguageCode) => void;
  navigateTo: (path: string) => void;
}

const NavTop = ({language, languageList, onChangeLanguage, navigateTo}: IProps) => (
  <Container className={styles.containerTop}>
    <div className={styles.inner}>
      <Menu.Item
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
        <Menu.Item
          name="Sign in!"
          as="a"
          className={`${styles.item} ${styles.itemLogIn}`}
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('/auth');
          }}
        />
        <LanguageSelector
          language={language}
          languageList={languageList}
          onChangeLanguage={onChangeLanguage}
        />
      </Menu>
    </div>
  </Container>
);

export default NavTop;
