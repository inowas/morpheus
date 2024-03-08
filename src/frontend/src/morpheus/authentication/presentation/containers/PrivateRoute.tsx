import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import useAuthentication from '../../application/useAuthentication';


const PrivateRoute = () => {
  const {isAuthenticated} = useAuthentication();
  return isAuthenticated ? <Outlet/> : <Navigate to="/" replace={true}/>;
};

export default PrivateRoute;
