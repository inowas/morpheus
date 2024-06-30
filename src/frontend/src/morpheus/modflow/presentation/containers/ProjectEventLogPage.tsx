import React from 'react';
import {useProjectEventLog} from '../../application';
import Error from 'common/components/Error';
import Loading from 'common/components/Loading';
import {useParams} from 'react-router-dom';
import {DataGrid, Navbar, SectionTitle} from 'common/components';
import {Popup, Table} from 'semantic-ui-react';
import {BodyContent, ModflowContainer, SidebarContent} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import useProjectPrivileges from '../../application/useProjectPrivileges';


const ProjectEventLogPage = () => {

  const {projectId} = useParams();
  const {events, loading, error} = useProjectEventLog(projectId as string);

  const navigateTo = useNavigate();
  const location = useLocation();

  const {isReadOnly} = useProjectPrivileges(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);


  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Error message={error.message}/>;
  }

  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
      />
      <ModflowContainer overflow={'auto'}>
        <SidebarContent maxWidth={400}>
          <DataGrid>
            <SectionTitle title={'Event Log'}/>
          </DataGrid>
        </SidebarContent>
        <BodyContent>
          <Table
            striped={true} selectable={true}
            style={{padding: '0 1em', width: '100%'}}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Event</Table.HeaderCell>
                <Table.HeaderCell>Payload</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {events.map((event, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{events.length - index}</Table.Cell>
                  <Table.Cell>{event.occurred_at}</Table.Cell>
                  <Table.Cell>{event.event_name}</Table.Cell>
                  <Table.Cell>
                    <Popup
                      trigger={<span>View</span>}
                      content={<pre>{JSON.stringify(event.payload, null, 2)}</pre>}
                      on='click'
                      position='right center'
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </BodyContent>
      </ModflowContainer>
    </>

  );
};

export default ProjectEventLogPage;
