import React from 'react';
import {Route, Routes} from 'react-router-dom';
import T02Container from 'simpletools/T02/presentation/containers/T02Container';
import T08Container from 'simpletools/T08/presentation/containers/T08Container';
import T13Container from 'simpletools/T13/presentation/containers/T13Container';
import T13AContainer from 'simpletools/T13/presentation/containers/T13AContainer';
import T13BContainer from 'simpletools/T13/presentation/containers/T13BContainer';
import T13CContainer from 'simpletools/T13/presentation/containers/T13CContainer';
// import T13DContainer from 'simpletools/T13/presentation/containers/T13DContainer';
// import T13EContainer from 'simpletools/T13/presentation/containers/T13EContainer';
import DashboardContainer from './application/presentation/containers/DashboardContainer';
import ApplicationContainer from './application/presentation/containers/ApplicationContainer';
import NotFoundContainer from './application/presentation/containers/NotFoundContainer';
import SignIn from './application/presentation/containers/AuthContainer';

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
      <Route path="/T08" element={wrapRouteComponent(<T08Container/>)}/>
      <Route path="/T13" element={wrapRouteComponent(<T13Container/>)}/>
      <Route path="/T13A" element={wrapRouteComponent(<T13AContainer/>)}/>
      <Route path="/T13B" element={wrapRouteComponent(<T13BContainer/>)}/>
      <Route path="/T13C" element={wrapRouteComponent(<T13CContainer/>)}/>
      {/*<Route path="/T13D" element={wrapRouteComponent(<T13DContainer/>)}/>*/}
      {/*<Route path="/T13E" element={wrapRouteComponent(<T13EContainer/>)}/>*/}
      <Route path="*" element={wrapRouteComponent(<NotFoundContainer/>)}/>
      <Route path="/auth" element={wrapRouteComponent(<SignIn/>)}/>
    </Routes>
  );
};

export default Router;
