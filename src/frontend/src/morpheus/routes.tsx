import React from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import {NotFound} from 'common/components';

import AboutUsPage from './application/presentation/containers/AboutUsContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import {ProjectAssetsPage, ProjectBaseModelPage, ProjectPage, ProjectScenariosPage, ProjectsSettingsPage} from './modflow/presentation/containers';
import SignInPage from './authentication/presentation/containers/SignInPage';
import PrivateRoute from './authentication/presentation/containers/PrivateRoute';
import ProjectsPage from './modflow/presentation/containers/ProjectListPage';
import AuthCallback from './authentication/presentation/containers/AuthCallbackPage';


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
      <Route path="/" element={<Navigate replace={true} to="/projects"/>}/>
      <Route path="/auth" element={wrapPublicComponent(<SignInPage/>)}/>
      <Route path="/auth/callback" element={wrapPublicComponent(<AuthCallback redirectTo="/projects"/>)}/>
      <Route path="/projects" element={wrapPrivateComponent(<ProjectsPage basePath={'/projects'}/>, true)}/>
      <Route path="/projects/:projectId" element={wrapPrivateComponent(<ProjectPage basePath={'/projects'}/>, true)}/>
      <Route
        path="/projects/:projectId/model/:property?/:propertyId?"
        element={wrapPrivateComponent(<ProjectBaseModelPage basePath={'/projects'} section={'model'}/>, true)}
      />
      <Route
        path="/projects/:projectId/scenarios/:scenarioId?/:property?/:propertyId?"
        element={wrapPrivateComponent(<ProjectScenariosPage basePath={'/projects'} section={'scenarios'}/>, true)}
      />
      <Route path="/projects/:projectId/assets" element={wrapPrivateComponent(<ProjectAssetsPage basePath={'/projects'}/>, true)}/>
      <Route path="/projects/:projectId/settings/:property?" element={wrapPrivateComponent(<ProjectsSettingsPage basePath={'/projects'}/>, true)}/>

      <Route path="/private" element={wrapPrivateComponent(<div>Private</div>)}/>
      <Route path="/about-us" element={wrapPublicComponent(<AboutUsPage/>)}/>
      <Route path="*" element={wrapPublicComponent(<NotFound/>)}/>
    </Routes>
  );
};

export default Router;
