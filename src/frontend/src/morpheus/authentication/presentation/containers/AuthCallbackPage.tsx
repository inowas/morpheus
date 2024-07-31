import {Grid, Header} from 'semantic-ui-react';
import React from 'react';
import {Navigate} from 'react-router-dom';
import useAuthentication from '../../application/useAuthentication';
import {Button} from 'common/components';

interface IProps {
  redirectTo: string;
}

const AuthCallback = ({redirectTo}: IProps) => {
  const {isAuthenticated, isLoading, signOutLocally, error} = useAuthentication();
  return (
    <Grid
      centered={true} verticalAlign="middle"
      style={{height: '100%', padding: '150px 0'}}
    >
      <Grid.Column style={{maxWidth: 450}}>

        {isLoading &&
          <Header as="h2" textAlign="center">
            Signing in ...
          </Header>
        }

        {error &&
          <Header as="h2" textAlign="center">
            Error: {error.message}
            <Button onClick={signOutLocally}>Try again</Button>
          </Header>
        }

        {isAuthenticated &&
          <Header as="h2" textAlign="center">
            Signed in, redirecting ...
            <Navigate to={redirectTo}/>
          </Header>
        }

      </Grid.Column>
    </Grid>
  );
};

export default AuthCallback;
