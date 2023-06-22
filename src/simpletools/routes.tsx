import React, {useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import T02Container from 'simpletools/T02/presentation/containers/T02Container';
import DashboardContainer from './application/presentation/containers/DashboardContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';

const Router = () => {
  const location = useLocation();
  const body = document.body;

  // FIXME what is the best way to implement this logic?
  useEffect(() => {
    if ('/T02' === location.pathname) {
      body.classList.add('fixedWidth');
    } else {
      body.classList.remove('fixedWidth');
    }
  }, [location.pathname]);

  const wrapRouteComponent = (component: React.ReactElement) => (
    <ApplicationContainer>
      {component}
    </ApplicationContainer>
  );

  return (
    <Routes>
      <Route path="/" element={wrapRouteComponent(<DashboardContainer/>)}/>
      <Route path="/T02" element={wrapRouteComponent(<T02Container/>)}/>
      <Route path="*" element={wrapRouteComponent(<NotFoundContainer/>)}/>
    </Routes>
  );
};

export default Router;
