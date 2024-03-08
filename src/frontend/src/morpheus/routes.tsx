import {Route, Routes} from 'react-router-dom';

import AboutUsContainer from './application/presentation/containers/AboutUsContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import FilterProjects from './application/presentation/containers/FilterProjects';
import HomeContainer from './application/presentation/containers/HomeContainer';
import ModelSidebar from './application/presentation/containers/ModelSidebar';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import {ProjectDashboardContainer} from './modflow/presentation/containers';
import React from 'react';
import SignIn from './application/presentation/containers/AuthContainer';

const Router = () => {
  const wrapRouteComponent = (component: React.ReactElement) => (
    <ApplicationContainer>
      {component}
    </ApplicationContainer>
  );

  return (
    <Routes>
      <Route path="/" element={wrapRouteComponent(<HomeContainer/>)}/>
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
