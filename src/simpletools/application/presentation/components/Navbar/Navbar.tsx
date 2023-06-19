import React, {useState} from 'react';
import {Button, Container, Dropdown, Image, Menu} from 'semantic-ui-react';
import {IDropdownItem, IMenuItem, INavbarItem} from './types/navbar.type';
import {Link, useLocation} from 'react-router-dom';
import styles from './Navbar.module.less';
import useIsMobile from 'simpletools/common/hooks/useIsMobile';


interface IProps {
  navbarItems: INavbarItem[];
  navigateTo: (path: string) => void;
}

const Navbar = ({navbarItems, navigateTo}: IProps) => {

  const isMenuItem = (item: IMenuItem | IDropdownItem): item is IMenuItem => (item as IMenuItem).to !== undefined;
  const isDropdownItem = (item: IMenuItem | IDropdownItem): item is IDropdownItem => (item as IDropdownItem).basepath !== undefined;

  const location = useLocation();
  const pathname = 1 < location.pathname.length ? location.pathname.slice(1) : 'Home';
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(pathname);

  const {isMobile} = useIsMobile();

  const redirectTo = (path: string | undefined) => {
    if (path) {
      navigateTo(path);
      setOpenMobileMenu(!openMobileMenu);
    }
    if (isMobile) {
      setOpenMobileMenu(false);
    }
    if (isMobile) {
      setOpenMobileMenu(false);
    }
  };

  const handleCloseMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Container className={styles.container}>
          <div className={styles.inner}>
            <Link to="/" className={styles.logo}>
              <svg
                xmlns="http://www.w3.org/2000/svg" width="100%"
                height="100%" viewBox="0 0 168 50"
              >
                <path
                  fill="currentColor"
                  d="M148.121 18.408h2.252v-2.299h-2.252v2.299zM154.268 18.408h2.252v-2.299h-2.252v2.299zM116.775 25.916c1.269-.422 2.347-1.596 2.347-3.426 0-2.158-1.547-3.988-4.224-3.988h-5.112v13.092h2.532v-5.256h1.83l2.58 5.256h2.957l-2.91-5.678zm-2.017-1.689h-2.439v-3.473h2.439c1.08 0 1.83.752 1.83 1.736 0 1.032-.75 1.737-1.83 1.737zM150.701 27.09l1.642-4.74 1.597 4.74h-3.239zm.61-8.588l-4.785 13.092h2.675l.797-2.348h4.646l.75 2.348h2.676l-4.786-13.092h-1.973zM63.519 26.994c0 1.502-.938 2.393-2.299 2.393s-2.252-.891-2.252-2.393v-8.492h-2.534v8.586c0 2.77 2.111 4.6 4.786 4.6 2.675 0 4.833-1.83 4.833-4.6v-8.586h-2.534v8.492zM76.47 26.479l-5.161-7.977h-2.301v13.092h2.581v-8.072l5.162 8.072h2.299V18.502h-2.58v7.977zM82.1 31.594h2.58V18.502H82.1v13.092zM96.928 18.502h-2.674l-2.629 8.492-2.627-8.492h-2.627l4.316 13.092h1.877l4.364-13.092zM107.203 20.754v-2.252h-8.586v13.045h8.586v-2.252h-6.053v-3.191h5.162v-2.251h-5.162v-3.098l6.053-.001zM130.336 27.697c0-1.125-.327-2.109-1.031-2.768-.516-.516-1.268-.844-2.486-.984l-1.549-.234c-.518-.094-.938-.281-1.221-.517a1.398 1.398 0 0 1-.375-.938c0-.892.656-1.643 2.018-1.643.892 0 1.877.094 2.675.893l1.644-1.596c-1.127-1.08-2.439-1.549-4.224-1.549-2.815 0-4.552 1.643-4.552 3.988 0 1.08.281 1.924.938 2.58.563.564 1.408.893 2.533 1.081l1.549.233c.611.094.938.188 1.174.422.281.28.422.655.422 1.127 0 1.03-.846 1.595-2.346 1.595-1.174 0-2.299-.281-3.145-1.078l-1.644 1.643c1.269 1.314 2.769 1.736 4.787 1.736 2.722 0 4.833-1.456 4.833-3.991zM135.357 18.502h-2.533v13.092h2.533V18.502zM146.947 18.502h-9.385v2.252h3.426v10.793h2.533V20.754h3.426v-2.252zM157.691 20.754h3.426v10.84h2.535v-10.84h3.425v-2.252h-9.386v2.252zM64.598 37.178c-.845-.893-2.064-1.27-3.426-1.27h-4.739v13.094h4.739c1.361 0 2.581-.375 3.426-1.268 1.501-1.455 1.314-3.379 1.314-5.348 0-1.972.187-3.753-1.314-5.208zm-1.783 8.726c-.424.516-1.033.797-1.877.797h-1.925v-8.492h1.925c.844 0 1.453.281 1.877.799.469.563.563 1.406.563 3.379 0 2.015-.094 2.955-.563 3.517zM75.625 43.371c1.267-.469 2.393-1.596 2.393-3.426 0-2.205-1.596-4.035-4.27-4.035h-5.114v13.092h2.533v-5.209h1.877l2.534 5.209h2.956l-2.909-5.631zm-2.019-1.736h-2.439v-3.426h2.439c1.126 0 1.83.705 1.83 1.736.001.987-.704 1.69-1.83 1.69zM80.739 49.002h8.634v-2.301h-6.1v-3.143h5.163v-2.299h-5.163v-3.051h6.1v-2.301h-8.634v13.095zM96.881 41.354l-1.548-.235a2.231 2.231 0 0 1-1.22-.517c-.282-.231-.377-.608-.377-.938 0-.891.658-1.643 2.019-1.643.845 0 1.876.141 2.675.893l1.641-1.596c-1.125-1.078-2.438-1.502-4.221-1.502-2.863 0-4.553 1.643-4.553 3.94 0 1.125.281 1.972.893 2.58.608.563 1.453.938 2.58 1.08l1.549.233c.609.095.892.234 1.174.47.279.235.375.61.375 1.08 0 1.077-.799 1.644-2.301 1.644-1.219 0-2.346-.283-3.144-1.128l-1.642 1.644c1.267 1.313 2.768 1.734 4.738 1.734 2.77 0 4.881-1.406 4.881-3.939 0-1.174-.33-2.111-1.032-2.77-.563-.515-1.313-.843-2.487-1.03zM111.051 37.178c-.845-.893-2.111-1.27-3.472-1.27h-4.692v13.094h4.692c1.36 0 2.627-.375 3.472-1.268 1.455-1.455 1.314-3.379 1.314-5.348 0-1.972.141-3.753-1.314-5.208zm-1.783 8.726c-.422.516-1.031.797-1.924.797h-1.924v-8.492h1.924c.893 0 1.502.281 1.924.799.471.563.564 1.406.564 3.379 0 2.015-.096 2.955-.564 3.517zM115.086 49.002h8.588v-2.301h-6.053v-3.143h5.16v-2.299h-5.16v-3.051h6.053v-2.301h-8.588v13.095zM133.715 43.934l-5.16-8.022h-2.301v13.092h2.581V40.98l5.161 8.024h2.3V35.91h-2.581v8.024zM59.858 14.092h2.534V3.299h3.426V1.047h-9.386v2.252h3.426v10.793zM76.798 11.839h-6.101v-3.19h5.162V6.396h-5.162V3.299h6.101V1.047h-8.634v13.045h8.634v-2.253zM88.67 10.104h-2.582c-.281 1.031-.938 1.83-2.205 1.83-.704 0-1.267-.234-1.642-.658-.517-.563-.657-1.172-.657-3.707 0-2.533.141-3.143.657-3.707.375-.422.938-.656 1.642-.656 1.268 0 1.924.798 2.205 1.83h2.582C88.2 2.315 86.275.907 83.836.907c-1.407 0-2.581.516-3.519 1.455-1.314 1.313-1.268 2.955-1.268 5.207s-.047 3.896 1.268 5.209c.938.938 2.111 1.455 3.519 1.455 2.439-.001 4.364-1.409 4.834-4.129zM93.596 8.648h4.459v5.443h2.533V1.047h-2.533v5.35h-4.459v-5.35h-2.533v13.045h2.533V8.648zM106.406 6.067l5.207 8.024h2.254V1.047h-2.535v7.977l-5.207-7.977h-2.254v13.045h2.535V6.067zM119.686 1.047h-2.535v13.045h2.535V1.047zM126.582 11.934c-1.173 0-2.299-.283-3.143-1.08l-1.644 1.643c1.267 1.314 2.769 1.736 4.785 1.736 2.724 0 4.834-1.455 4.834-3.988 0-1.126-.328-2.112-1.033-2.77-.516-.516-1.267-.844-2.485-.984l-1.549-.235c-.517-.093-.938-.28-1.22-.516-.235-.281-.377-.61-.377-.938 0-.892.657-1.642 2.019-1.642.893 0 1.877.093 2.676.891l1.643-1.595c-1.127-1.08-2.439-1.549-4.224-1.549-2.815 0-4.552 1.643-4.552 3.988 0 1.08.28 1.924.938 2.58.563.563 1.407.893 2.533 1.08l1.549.234c.608.094.938.188 1.172.422.283.282.425.657.425 1.126.001 1.033-.845 1.597-2.347 1.597zM138.454 14.232c2.394 0 4.317-1.408 4.786-4.129h-2.581c-.235 1.031-.938 1.83-2.205 1.83-.704 0-1.267-.235-1.644-.657-.47-.563-.608-1.173-.608-3.707s.14-3.144.608-3.707c.377-.423.938-.657 1.644-.657 1.267 0 1.97.798 2.205 1.83h2.581c-.469-2.721-2.346-4.129-4.786-4.129-1.454 0-2.628.516-3.567 1.455-1.313 1.313-1.266 2.956-1.266 5.208s-.047 3.896 1.266 5.208c.939.94 2.113 1.455 3.567 1.455zM148.214 8.648h4.411v5.443h2.533V1.047h-2.533v5.35h-4.411v-5.35h-2.581v13.045h2.581V8.648zM167.123 3.299V1.047h-8.633v13.045h8.633V11.84h-6.1V8.648h5.162V6.396h-5.162V3.299h6.1zM29.97 17.048v15.249H19.787V17.048H5.522L17.159 5.411h15.438l11.636 11.637H29.97zM16.55 3.956L3.786 16.719v1.783h14.546v15.25h13.092v-15.25h14.498v-1.783L33.159 3.956H16.55z"
                />
                <path
                  fill="currentColor"
                  d="M47.377 33.893L33.724 47.547H15.986L2.331 33.893V16.156L15.986 2.502h17.737l13.653 13.654.001 17.737zM15.423 1.047L.877 15.593v18.862l14.546 14.547h18.91l14.499-14.547V15.593L34.333 1.047h-18.91z"
                />
                <path
                  fill="currentColor"
                  d="M34.333 21.411h10.183l-.048 11.356-11.87 11.871H17.159L5.241 32.768V21.411h10.182V36.66h18.91V21.411zm-1.455 13.796h-16v-15.25H3.786V33.33l12.763 12.762H33.16L45.923 33.33V19.957H32.878v15.25z"
                />
              </svg>
            </Link>
            <Menu
              className={styles.menu} secondary={true}
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
            </Menu>
          </div>
        </Container>
      </div>
      <div className={styles.wrapperNavigation}>
        <Container>
          <Menu
            pointing={true}
            secondary={true}
            className="mainMenu"
          >
            <div className={styles.mainMenuLogo}>
              <Image
                alt="An example alt"
                as="a"
                href="/"
                size="tiny"
                src={'https://inowas.com/wp-content/uploads/2019/11/Logo_INOWAS_2019-1.png'}
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
            {(isMobile ? openMobileMenu : true) && <div
              className="navbar"
            >
              <Container>
                {navbarItems.map((item: INavbarItem) => {
                  if (isMenuItem(item)) {
                    return (
                      <Menu.Item
                        key={item.name}
                        name={item.name}
                        active={item.name === activeItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          redirectTo(item.to);
                          setActiveItem(item.name);
                        }}
                      >
                        <span className="text">{item.label}</span>
                      </Menu.Item>
                    );
                  }
                  if (isDropdownItem(item)) {
                    return (
                      <Dropdown
                        className={item.name === activeItem ? 'active' : ''}
                        key={item.name}
                        icon={null}
                        item={true}
                        closeOnChange={true}
                        closeOnBlur={isMobile && false}
                      >
                        <>
                          <Menu.Item
                            name={item.name}
                            className="itemDropdown"
                            active={item.name === activeItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              redirectTo(item.basepath);
                              setActiveItem(item.name);
                            }}
                          >
                            <span className="text">{item.label}</span>
                          </Menu.Item>
                          {isMobile && <button aria-label="Togle menu" className="btnDropdown">
                            <span aria-hidden="true" className="icon"></span>
                          </button>}
                          <Dropdown.Menu
                            className="dropdownMenu"
                          >
                            {item.subMenu.map((subItem) => (
                              <Dropdown.Item
                                className={subItem.name === activeItem ? 'active' : ''}
                                key={subItem.name}
                                icon={null}
                                text={subItem.label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  redirectTo(subItem.to);
                                  setActiveItem(subItem.name);
                                }}
                              />
                            ))}
                          </Dropdown.Menu>
                        </>
                      </Dropdown>
                    );
                  }
                  return null;
                })}
                <Button
                  className="mainMenuButton" onClick={() => {
                    console.log('click');
                  }}
                >
                  <span>Sign in!</span>
                </Button>
              </Container>
            </div>}
          </Menu>
        </Container>
      </div>
    </>
  );
};

export default Navbar;
