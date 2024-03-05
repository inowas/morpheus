import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import SignIn from './application/presentation/containers/AuthContainer';
import AboutUsContainer from './application/presentation/containers/AboutUsContainer';
import FilterProjects from './application/presentation/containers/FilterProjects';
import ModelSidebar from './application/presentation/containers/ModelSidebar';
import {ProjectDashboardContainer} from './modflow/presentation/containers';

const Router = () => {
  const wrapRouteComponent = (component: React.ReactElement) => (
    <ApplicationContainer>
      {component}
    </ApplicationContainer>
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/models"/>}/>
      <Route path="/news" element={wrapRouteComponent(<ProjectDashboardContainer/>)}/>
      <Route path="/auth" element={wrapRouteComponent(<SignIn/>)}/>
      <Route path="/about-us" element={wrapRouteComponent(<AboutUsContainer/>)}/>
      <Route path="/filter" element={<FilterProjects/>}/>
      <Route path="/models" element={<ModelSidebar/>}/>
      <Route path="*" element={wrapRouteComponent(<NotFoundContainer/>)}/>
    </Routes>
  );
};

export default Router;
