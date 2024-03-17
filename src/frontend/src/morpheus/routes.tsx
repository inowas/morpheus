import React from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import {NotFound} from 'common/components';

import AboutUsPage from './application/presentation/containers/AboutUsContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import {ProjectAssetsPage, ProjectBaseModelPage, ProjectPage, ProjectScenariosPage, ProjectsSettingsPage} from './modflow/presentation/containers';
import SignInPage from './authentication/presentation/containers/AuthContainer';
import PrivateRoute from './authentication/presentation/containers/PrivateRoute';
import ProjectsPage from './modflow/presentation/containers/ProjectListPage';


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
      <Route path="/projects" element={wrapPublicComponent(<ProjectsPage basePath={'/projects'}/>, true)}/>
      <Route path="/projects/:projectId" element={wrapPublicComponent(<ProjectPage basePath={'/projects'}/>, true)}/>
      <Route
        path="/projects/:projectId/basemodel/:property?/:propertyId?"
        element={wrapPublicComponent(<ProjectBaseModelPage basePath={'/projects'} section={'basemodel'}/>, true)}
      />
      <Route
        path="/projects/:projectId/scenarios/:scenarioId?/:property?/:propertyId?"
        element={wrapPublicComponent(<ProjectScenariosPage basePath={'/projects'} section={'scenarios'}/>, true)}
      />
      <Route path="/projects/:projectId/assets" element={wrapPublicComponent(<ProjectAssetsPage basePath={'/projects'}/>, true)}/>
      <Route path="/projects/:projectId/settings/:property?" element={wrapPublicComponent(<ProjectsSettingsPage basePath={'/projects'}/>, true)}/>

      <Route path="/private" element={wrapPrivateComponent(<div>Private</div>)}/>
      <Route path="/about-us" element={wrapPublicComponent(<AboutUsPage/>)}/>
      <Route path="*" element={wrapPublicComponent(<NotFound/>)}/>
    </Routes>
  );
};

export default Router;
