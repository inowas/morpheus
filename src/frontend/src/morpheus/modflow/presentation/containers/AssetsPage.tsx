import React from 'react';
import {ContentWrapper, Navbar} from 'common/components';
import {ModflowContainer} from '../components';
import {useLocation, useNavigate} from 'common/hooks';
import {useNavbarItems} from '../../../application/application';
import {useParams} from 'react-router-dom';
import useProjectPermissions from '../../application/useProjectPermissions';
import useAssets from '../../application/useAssets';
import {Container, Header, Segment, Table} from 'semantic-ui-react';

interface IProps {
  basePath: string;
}

const AssetsPage = ({}: IProps) => {
  const {projectId} = useParams();
  const navigateTo = useNavigate();
  const location = useLocation();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {assets, loading, deleteAsset} = useAssets(projectId as string);
  const {navbarItems} = useNavbarItems(projectId as string, isReadOnly);


  return (
    <>
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={navigateTo}
      />
      <ModflowContainer>
        <ContentWrapper>
          <Container>
            <Header as={'h1'} style={{marginTop: 20}}>Assets</Header>
            <p>Assets are files that are uploaded to the project. They can be used for different purposes, e.g. to
              represent boundary conditions or to provide additional information.</p>
            <Container>
              <Segment loading={loading} raised={true}>
                <Table celled={true} singleLine={true}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Asset ID</Table.HeaderCell>
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Filename</Table.HeaderCell>
                      {!isReadOnly && <Table.HeaderCell>Actions</Table.HeaderCell>}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {assets.map((asset) => (
                      <Table.Row key={asset.asset_id}>
                        <Table.Cell>{asset.asset_id}</Table.Cell>
                        <Table.Cell>{asset.type}</Table.Cell>
                        <Table.Cell>{asset.file.file_name}</Table.Cell>
                        {!isReadOnly && <Table.Cell>
                          <a onClick={() => deleteAsset(asset.asset_id)}>Delete</a>
                        </Table.Cell>}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Segment>
            </Container>
          </Container>
        </ContentWrapper>

      </ModflowContainer>
    </>
  );
};


export default AssetsPage;
