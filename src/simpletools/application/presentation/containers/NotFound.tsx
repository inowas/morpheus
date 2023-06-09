import React from "react";

const styles = {
  wrapper: {
    width: "auto",
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    fontSize: '66px',
    lineHeight: '72px',
    display: 'block',
    boxShadow: '0 3px 2px 0 rgb(50 50 50 / 6%)'

  },
  footer: {
    marginTop: '20px',
    width: '100%',
    minHeight: '150px',
  },

};

const NotFound = () => {
  return (
    <div
      //FIXME:
      style={styles.wrapper}
    >
      <h1 style={styles.title}>404</h1>
      <p>Oops. The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
