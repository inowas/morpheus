import React from 'react';
import {BodyContent, SidebarContent} from '../components';
import {TestingBody, TestingContent} from '../components/Testing';


const TestingContainer = () => {
  return (
    <>
      <SidebarContent maxWidth={600}>
        <TestingContent/>
      </SidebarContent>
      <BodyContent>
        <TestingBody/>
      </BodyContent>
    </>
  );
};

export default TestingContainer;
