import React from 'react';
import {useAuthentication} from '../../outgoing';
import {Navigate} from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
}

const PrivateRoute = ({children}: IProps) => {
  const {isAuthenticated} = useAuthentication();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Navigate replace={true} to="/auth"/>
  );

};

export default PrivateRoute;
