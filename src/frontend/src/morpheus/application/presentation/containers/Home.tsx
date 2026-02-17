import React from 'react';
import {Button, Grid, Header} from 'semantic-ui-react';
import {useAuthentication} from '../../incoming';
import {Navigate} from 'react-router-dom';

const HomePage = () => {

  const {isAuthenticated, login} = useAuthentication();

  if (isAuthenticated) {
    return (
      <Navigate to={'/projects'} replace={true}/>
    );
  }

  return (
    <Grid
      centered={true} verticalAlign="middle"
      style={{height: '100%', padding: '150px 0'}}
    >
      <Grid.Column style={{maxWidth: 600}}>
        <Header as="h1" textAlign="center">
          Welcome to the INOWAS platform
        </Header>
        <p style={{textAlign: 'center'}}>
          Please login in to use the platform.
        </p>
        <Button
          color="blue"
          fluid={true}
          size="large"
          onClick={() => login()}
        >
          Login
        </Button>
      </Grid.Column>
    </Grid>
  );
};

export default HomePage;
