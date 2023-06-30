import React from 'react';
import {Route, Routes} from 'react-router-dom';
import T02Container from 'simpletools/T02/presentation/containers/T02Container';
import T08Container from 'simpletools/T08/presentation/containers/T08Container';
import DashboardContainer from './application/presentation/containers/DashboardContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import SignIn from './application/presentation/containers/AuthContainer';

const Router = () => {
  const wrapRouteComponent = (component: React.ReactElement) => (
    <ApplicationContainer>
      {component}
    </ApplicationContainer>
  );

  return (
    <Routes>
      <Route path="/" element={wrapRouteComponent(<DashboardContainer/>)}/>
      <Route path="/T02" element={wrapRouteComponent(<T02Container/>)}/>
      <Route path="/T08" element={wrapRouteComponent(<T08Container/>)}/>
      <Route path="*" element={wrapRouteComponent(<NotFoundContainer/>)}/>
      <Route path="/auth" element={wrapRouteComponent(<SignIn/>)}/>
    </Routes>
  );
};

export default Router;
