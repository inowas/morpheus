import React from 'react';
import {Route, Routes} from 'react-router-dom';

import AboutUsPage from './application/presentation/containers/AboutUsContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import HomePage from './application/presentation/containers/HomeContainer';
import {ModflowBaseModelPage} from './modflow/presentation/containers';

import SignInPage from './authentication/presentation/containers/AuthContainer';
import PrivateRoute from './authentication/presentation/containers/PrivateRoute';
import ProjectListPage from './modflow/presentation/containers/ProjectListPage';
import {NotFound} from '../common/components';

const Router = () => {
  const wrapPublicComponent = (component: React.ReactElement, disableFooter: boolean = false) => {
    return (
      <ApplicationContainer disableFooter={disableFooter}>
        {component}
      </ApplicationContainer>
    );
  };

  const wrapPrivateComponent = (component: React.ReactElement, disableFooter: boolean = false) => {
    return (
      <PrivateRoute>
        <ApplicationContainer disableFooter={disableFooter}>
          {component}
        </ApplicationContainer>
      </PrivateRoute>
    );
  };

  return (
    <Routes>
      <Route path="/" element={wrapPublicComponent(<HomePage/>)}/>
      <Route path="/auth" element={wrapPublicComponent(<SignInPage/>)}/>
      <Route
        path="/modflow"
        element={wrapPublicComponent(<ProjectListPage basePath={'/modflow'}/>, true)}
      />
      <Route
        path="/modflow/:id/:property?/:propertyId?"
        element={wrapPublicComponent(<ModflowBaseModelPage basePath={'/modflow'}/>, true)}
      />
      <Route path="/about-us" element={wrapPublicComponent(<AboutUsPage/>)}/>
      <Route path="*" element={wrapPublicComponent(<NotFound/>)}/>
    </Routes>
  );
};

export default Router;
