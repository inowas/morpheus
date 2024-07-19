import {Button, Grid, Header, Segment} from 'semantic-ui-react';
import React from 'react';
import useAuthentication from '../../application/useAuthentication';

const SignInPage = () => {

  const {isAuthenticated, isLoading, signIn, signOutLocally, error} = useAuthentication();

  const handleSignOut = async () => {
    await signOutLocally();
  };

  const renderSignInButton = () => {
    return (
      <Button
        color="blue" fluid={true}
        size="large" onClick={signIn}
        loading={isLoading}
      >
        Sign In with Keycloak
      </Button>
    );
  };

  const renderSignOutButton = () => {
    return (
      <Button
        color="red"
        fluid={true}
        size="large" onClick={signOutLocally}
        loading={isLoading}
      >
        Sign Out
      </Button>
    );
  };

  const renderError = () => {
    return (
      <Segment color="red">
        <strong>Error:</strong> {error?.message}
      </Segment>
    );
  };

  return (
    <Grid
      centered={true} verticalAlign="middle"
      style={{height: '100%', padding: '150px 0'}}
    >
      <Grid.Column style={{maxWidth: 450}}>
        <Header as="h2" textAlign="center">
          Authentication
        </Header>
        {error && renderError()}
        <Segment>
          {isAuthenticated ? renderSignOutButton() : renderSignInButton()}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default SignInPage;
