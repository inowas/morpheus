import React from 'react';
import {useAuthentication} from '../../outgoing';
import {Navigate} from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
}

const PrivateRoute = ({children}: IProps) => {
  const {isAuthenticated, isLoading} = useAuthentication();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Navigate replace={true} to="/auth"/>
  );

};

export default PrivateRoute;
