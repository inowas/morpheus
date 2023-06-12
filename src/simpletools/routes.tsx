import React from 'react';
import {Route, Routes} from 'react-router-dom';
import T02Container from 'simpletools/T02/presentation/containers/T02Container';
import DashboardContainer from './application/presentation/containers/DashboardContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import NotFoundPage from './application/presentation/containers/NotFoundPage';

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
      <Route path="*" element={wrapRouteComponent(<NotFoundPage/>)}/>
    </Routes>
  );
};

export default Router;
