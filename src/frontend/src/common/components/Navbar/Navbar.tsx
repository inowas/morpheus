import {Button, Modal, ModelCreate} from 'common/components';
import {Image, Input} from 'semantic-ui-react';
import React, {useState} from 'react';

import {INavbarItem} from './types/navbar.type';
import MenuItem from './MenuItem';
import logoInowas from './images/logo-inowas.png';
import styles from './Navbar.module.less';
import useIsMobile from 'common/hooks/useIsMobile';

interface IProps {
  navbarItems: INavbarItem[];
  pathname: string;
  navigateTo: (path: string) => void;
  showSearchWrapper?: boolean;
  showCreateButton?: boolean;
}

const Navbar: React.FC<IProps> = ({
  navbarItems,
  pathname,
  navigateTo,
  showSearchWrapper = false,
  showCreateButton = false,
}) => {
  const {isMobile} = useIsMobile();
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
      {/* Popup to create new model */}
      {showCreateButton && (
        <Modal.Modal
          onClose={() => setOpenPopup(false)}
          onOpen={() => setOpenPopup(true)}
          open={openPopup}
          dimmer={'inverted'}
        >
          <ModelCreate onClose={onCreateButtonClick}/>
        </Modal.Modal>
      )}
      {/* End of popup to create new model */}

      {/* Navbar */}
      <div
        className={styles.navbar}
        data-testid={'test-navbar'}
      >
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
              data-testid={'menu-trigger'}
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
          <nav
            data-testid={'test-nav'}
            className={`${styles.nav} ${openMobileMenu ? styles.navOpen : ''}`}
          >
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
                  className={styles.createButton}
                  primary={true}
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

export default Navbar;
