import {Button, Modal, ModelsCreate} from 'common/components';
import {Image, Input} from 'semantic-ui-react';
import React, {useState} from 'react';

import {INavbarItem} from '../types/navbar.type';
import MenuItem from './MenuItem';
import logoInowas from '../images/logo-inowas.png';
import styles from './NavBottom.module.less';
import useIsMobile from '../hooks/useIsMobile';

interface IProps {
  navbarItems: INavbarItem[];
  pathname: string;
  navigateTo: (path: string) => void;
  showSearchWrapper?: boolean;
  showCreateButton?: boolean;
}

const NavBottom: React.FC<IProps> = ({
  navbarItems,
  pathname,
  navigateTo,
  showSearchWrapper = false,
  showCreateButton = false,
}) => {
  const {isMobile} = useIsMobile(1199);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu((prevState) => !prevState);
  };

  const [openPopup, setOpenPopup] = useState(false);
  const onCreateButtonClick = () => {
    setOpenPopup(!openPopup);
  };

  return (
    <>
      {showCreateButton && (
        <Modal.Modal
          onClose={() => setOpenPopup(false)}
          onOpen={() => setOpenPopup(true)}
          open={openPopup}
          dimmer={'inverted'}
        >
          <ModelsCreate onClose={onCreateButtonClick}/>
        </Modal.Modal>
      )}
      <div className={styles.navBottom}>
        <div className={styles.inner}>
          <div className={styles.mainMenuLogo}>
            <Image
              alt="An example alt"
              as="a"
              href="/"
              size="tiny"
              src={logoInowas}
              className={styles.logo}
            />
            <p className={styles.description}>Innovative Groundwater Solutions</p>
          </div>
          {isMobile && (
            <div
              className={`${styles.menuTrigger} ${openMobileMenu ? styles.menuTrigger__open : ''}`}
              onClick={handleCloseMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          {(showSearchWrapper && !isMobile) && (
            <div className={styles.searchWrapper}>
              <Input
                action={true}
                actionPosition="left"
                className={`${styles.search}`}
              >
                <Button primary={true}>Search</Button>
                <input/>
              </Input>
            </div>
          )}
          <nav className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}>
            <div className={styles.navWrapper}>
              <ul className={styles.menu}>
                {navbarItems.map((item: INavbarItem, idx: number) => {
                  return <MenuItem
                    key={idx}
                    items={item}
                    onCloseMobileMenu={handleCloseMobileMenu}
                    pathname={pathname}
                    navigateTo={navigateTo}
                  />;
                })}
              </ul>
              {showCreateButton && (
                <Button
                  className={styles.createButton} primary={true}
                  onClick={onCreateButtonClick}
                >
                  Create new model
                </Button>
              )}
            </div>
            {(showSearchWrapper && isMobile) && (
              <div className={styles.searchWrapper}>
                <Input
                  action={true}
                  actionPosition="left"
                  className={`${styles.search}`}
                >
                  <Button primary={true}>Search</Button>
                  <input/>
                </Input>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBottom;
