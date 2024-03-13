import {Route, Routes} from 'react-router-dom';

import AboutUsContainer from './application/presentation/containers/AboutUsContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import FilterProjects from './application/presentation/containers/FilterProjects';
import HomeContainer from './application/presentation/containers/HomeContainer';
import ProjectContainer from './application/presentation/containers/ProjectContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import {ProjectDashboardContainer} from './modflow/presentation/containers';
import React from 'react';
import SignIn from './authentication/presentation/containers/AuthContainer';
import PrivateRoute from './authentication/presentation/containers/PrivateRoute';

const Router = () => {
  const wrapRouteComponent = (component: React.ReactElement, isPrivate: boolean = true) => {
    if (!isPrivate) {
      return (
        <ApplicationContainer>
          {component}
        </ApplicationContainer>
      );
    }

    return (
      <PrivateRoute>
        <ApplicationContainer>
          {component}
        </ApplicationContainer>
      </PrivateRoute>
    );
  };

  return (
    <Routes>
      <Route path="/" element={wrapRouteComponent(<HomeContainer/>, false)}/>
      <Route path="/auth" element={wrapRouteComponent(<SignIn/>, false)}/>

      <Route path="/news" element={wrapRouteComponent(<ProjectDashboardContainer/>)}/>
      <Route path="/about-us" element={wrapRouteComponent(<AboutUsContainer/>)}/>
      <Route path="/filter" element={<FilterProjects/>}/>
      <Route path="/models" element={<ProjectContainer/>}/>
      <Route path="*" element={wrapRouteComponent(<NotFoundContainer/>)}/>
    </Routes>
  );
};

export default Router;
