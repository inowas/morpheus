import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Container } from "semantic-ui-react";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";
import { Header } from "components";
import { useNavigate } from "react-router-dom";
import useNavbarItems from "../../application/useNavbarItems";
import NavbarTop from "../components/NavbarTop";

interface IProps {
  children: ReactNode;
}

const ApplicationContainer = ({ children }: IProps) => {
  const navigateTo = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);
  const { navbarItems } = useNavbarItems();
  const ref = useRef<any>(null);

  useEffect(() => {
    setHeaderHeight(ref.current.clientHeight);
  }, [])
  
  
  return (
    <>
      <Header
        style={{
          width: "100%",
          position: "fixed",
          top: "0",
          zIndex: 10,
          background: "#ffffff",
        }}
      >
        <div
          ref={ref}
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
        <NavbarTop navigateTo={navigateTo}  />
        <NavBar navbarItems={navbarItems} headerHeight={headerHeight} navigateTo={navigateTo} />
      </Header>

      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "40px 0",
          paddingTop: headerHeight + 'px',
          minHeight: "100vh",
        }}
      >
        {children}
      </Container>
      
      <Footer
        style={{
          marginTop: "20px",
          width: "100%",
          minHeight: "150px",
        }}
        width={1280}
      />
    </>
  );
};

export default ApplicationContainer;
