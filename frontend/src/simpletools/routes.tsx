import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import T02Container from 'simpletools/T02/presentation/containers/T02Container';
import T08Container from 'simpletools/T08/presentation/containers/T08Container';
import {T13AContainer, T13BContainer, T13CContainer, T13Container, T13DContainer, T13EContainer} from 'simpletools/T13/presentation/containers/';
import T18Container from 'simpletools/T18/presentation/containers/T18Container';
import {T09AContainer, T09BContainer, T09CContainer, T09Container, T09DContainer, T09EContainer, T09FContainer} from 'simpletools/T09/presentation/containers';
import DashboardContainer from './application/presentation/containers/DashboardContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import SignIn from './application/presentation/containers/AuthContainer';
import BreadcrumbComponent from './application/presentation/components/BreadcrumbComponent/BreadcrumbComponent';

const Router = () => {
  const wrapRouteComponent = (component: React.ReactElement, breadcrumb: boolean = false) => (
    <ApplicationContainer>
      {breadcrumb && <BreadcrumbComponent/>}
      {component}
    </ApplicationContainer>
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tools"/>}/>
      <Route path="/tools" element={wrapRouteComponent(<DashboardContainer/>)}/>
      <Route path="/tools/T02" element={wrapRouteComponent(<T02Container/>, true)}/>
      <Route path="/tools/T08" element={wrapRouteComponent(<T08Container/>, true)}/>
      <Route path="/tools/T09" element={wrapRouteComponent(<T09Container/>, true)}/>
      <Route path="/tools/T09/T09A" element={wrapRouteComponent(<T09AContainer/>, true)}/>
      <Route path="/tools/T09/T09B" element={wrapRouteComponent(<T09BContainer/>, true)}/>
      <Route path="/tools/T09/T09C" element={wrapRouteComponent(<T09CContainer/>, true)}/>
      <Route path="/tools/T09/T09D" element={wrapRouteComponent(<T09DContainer/>, true)}/>
      <Route path="/tools/T09/T09E" element={wrapRouteComponent(<T09EContainer/>, true)}/>
      <Route path="/tools/T09/T09F" element={wrapRouteComponent(<T09FContainer/>, true)}/>
      <Route path="/tools/T13" element={wrapRouteComponent(<T13Container/>, true)}/>
      <Route path="/tools/T13/T13A" element={wrapRouteComponent(<T13AContainer/>, true)}/>
      <Route path="/tools/T13/T13B" element={wrapRouteComponent(<T13BContainer/>, true)}/>
      <Route path="/tools/T13/T13C" element={wrapRouteComponent(<T13CContainer/>, true)}/>
      <Route path="/tools/T13/T13D" element={wrapRouteComponent(<T13DContainer/>, true)}/>
      <Route path="/tools/T13/T13E" element={wrapRouteComponent(<T13EContainer/>, true)}/>
      <Route path="/tools/T18" element={wrapRouteComponent(<T18Container/>)}/>
      <Route path="*" element={wrapRouteComponent(<NotFoundContainer/>)}/>
      <Route path="/auth" element={wrapRouteComponent(<SignIn/>)}/>
    </Routes>
  );
};

export default Router;
