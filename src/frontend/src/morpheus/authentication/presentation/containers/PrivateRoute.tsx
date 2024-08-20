import React from 'react';
import {Navigate} from 'react-router-dom';
import useAuthentication from '../../application/useAuthentication';

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
    <Navigate replace={true} to="/"/>
  );

};

export default PrivateRoute;
