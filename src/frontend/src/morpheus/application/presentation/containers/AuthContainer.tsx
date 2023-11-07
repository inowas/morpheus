import React, {useState} from 'react';
import {Button, Form, Grid, Header, Segment} from 'semantic-ui-react';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // FIXME Handle sign in logic here
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Signing in...');
  };

  return (
    <Grid
      centered={true} verticalAlign="middle"
      style={{height: '100%', padding: '150px 0'}}
    >
      <Grid.Column style={{maxWidth: 450}}>
        <Header as="h2" textAlign="center">
          Sign In
        </Header>
        <Segment>
          <Form size="large">
            <Form.Input
              fluid={true}
              icon="user"
              iconPosition="left"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid={true}
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <Button
              color="blue" fluid={true}
              size="large" onClick={handleSignIn}
            >
              Sign In
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};
export default SignIn;
