import {Route, Routes} from 'react-router-dom';

import AboutUsContainer from './application/presentation/containers/AboutUsContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import FilterProjects from './application/presentation/containers/FilterProjects';
import HomeContainer from './application/presentation/containers/HomeContainer';
import ProjectContainer from './application/presentation/containers/ProjectContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import {ModflowContainer} from './modflow/presentation/containers';
import React from 'react';
import SignIn from './authentication/presentation/containers/AuthContainer';
import PrivateRoute from './authentication/presentation/containers/PrivateRoute';

const Router = () => {
  const wrapPublicComponent = (component: React.ReactElement) => {
    return (
      <ApplicationContainer>
        {component}
      </ApplicationContainer>
    );
  };

  const wrapPrivateComponent = (component: React.ReactElement) => {
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
      <Route path="/" element={wrapPublicComponent(<HomeContainer/>)}/>
      <Route path="/auth" element={wrapPublicComponent(<SignIn/>)}/>
      <Route path="/modflow/:id?/:property?/:propertyId?" element={wrapPublicComponent(<ModflowContainer basePath={'/modflow'}/>)}/>
      <Route path="/about-us" element={wrapPublicComponent(<AboutUsContainer/>)}/>

      <Route path="/projects" element={wrapPrivateComponent(<ProjectContainer/>)}/>
      <Route path="/filter" element={wrapPrivateComponent(<FilterProjects/>)}/>
      <Route path="/news" element={wrapPrivateComponent(<ModflowContainer basePath={'/modflow'}/>)}/>
      <Route path="*" element={wrapPublicComponent(<NotFoundContainer/>)}/>
    </Routes>
  );
};

export default Router;
