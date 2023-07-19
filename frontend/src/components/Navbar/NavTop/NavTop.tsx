import React from 'react';
import {Container, Menu} from 'semantic-ui-react';
import {Link, useNavigate} from 'react-router-dom';
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
}

const NavTop = ({language, languageList, onChangeLanguage}: IProps) => {
  const navigateTo = useNavigate();

  return (
    <Container className={styles.containerTop}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img
            className={styles.logo}
            src={logoTUDresden}
            alt={'logo'}
          />
        </Link>
        <Menu
          className={styles.menu}
          secondary={true}
          position="right"
        >
          <Menu.Item
            name="Contact"
            as="a"
            className={styles.item}
            // active={activeItem === 'logout'}
            // onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Legal Notice"
            as="a"
            className={styles.item}
            // active={activeItem === 'logout'}
            // onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Accessibility"
            as="a"
            className={styles.item}
            // active={activeItem === 'logout'}
            // onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Sign in!"
            as="a"
            className={`${styles.item} ${styles.itemLogIn}`}
            // active={activeItem === 'logout'}
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
};

export default NavTop;
