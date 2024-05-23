import React, {useState} from 'react';
import {IBoundary, IBoundaryId, IBoundaryType, IObservation, IObservationId} from "../../../types/Boundaries.type";
import BoundaryList from "./BoundaryList";
import {Grid, InfoTitle, Tab} from 'common/components';
import {BoundariesForm} from "../BoundariesLayers/BoundariesForm";
import {MenuItem, TabPane} from "semantic-ui-react";
import {BoundariesTable} from "../BoundariesLayers/BoundariesTable";
import {ILayer} from "../../../types/Layers.type";

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  type: IBoundaryType;
  canManageObservations: boolean;
  onCloneBoundaries: (ids: IBoundary['id'][]) => void;
  onRemoveBoundaries: (ids: IBoundary['id'][]) => void;
  onUpdateBoundaries: (boundaries: IBoundary[]) => void;
  isReadOnly: boolean;
}

interface ISelectedObservation {
  boundaryId: IBoundaryId;
  observationId: IObservationId;
}

const BoundaryPaneContent = ({type, boundaries, layers, canManageObservations, onCloneBoundaries, onUpdateBoundaries, onRemoveBoundaries, isReadOnly}: IProps) => {

  const [selectedBoundaries, setSelectedBoundaries] = useState<IBoundary['id'][]>([]);
  const [selectedObservation, setSelectedObservation] = useState<ISelectedObservation | null>(null);

  const boundaryToShowData = boundaries.find(b => {
    return b.id === selectedObservation?.boundaryId;
  });

  const handleRename = (id: string, newTitle: string) => {
    const updatedBoundaries = boundaries.map(b => {
      if (b.id === id) {
        return {...b, name: newTitle};
      }
      return b;
    });
    onUpdateBoundaries(updatedBoundaries);
  }

  const handleDeleteSelectedItems = () => {
    onRemoveBoundaries(selectedBoundaries);
  }

  const handleClone = (id: string) => {
    onCloneBoundaries([id]);
  }

  return (
    <>
      <Grid.Grid
        columns={2}
        stackable={true}
        variant='secondary'
      >
        <Grid.Column width={9}>
          <BoundaryList
            type={type}
            boundaries={boundaries}
            canManageObservations={canManageObservations}
            selectedBoundaries={selectedBoundaries}
            selectedObservation={selectedObservation}
            onChangeSelectedBoundaries={(id: string[]) => setSelectedBoundaries(id)}
            onChangeSelectedObservation={setSelectedObservation}
            onRename={handleRename}
            onRemoveBoundaries={onRemoveBoundaries}
            onDelete={handleDeleteSelectedItems}
            onClone={handleClone}

          />
        </Grid.Column>
        <Grid.Column width={7} style={{marginTop: '12px'}}>
          <InfoTitle
            title="Properties"
            secondary={true}
            actions={[
              {actionText: 'Edit on map', onClick: () => console.log('Action 2')},
            ]}
          />
          <BoundariesForm
            type={type}
            boundaries={boundaries}
            onChangeBoundaries={onUpdateBoundaries}
            isReadOnly={isReadOnly}
            layers={layers}
          />
        </Grid.Column>
      </Grid.Grid>
      <Grid.Grid>
        <Tab
          style={{width: '100%'}}
          variant='primary'
          menu={{secondary: true, pointing: true}}
          panes={[
            {
              menuItem: (
                <MenuItem key='table'>
                  Table
                </MenuItem>
              ),
              render: () => <TabPane attached={false}>
                {boundaryToShowData && selectedObservation &&
                  <BoundariesTable
                    boundary={boundaryToShowData}
                    selectedObservation={selectedObservation.observationId}
                    formatDateTime={() => '2021-01-01'}
                  />
                }
              </TabPane>,
            },
            {
              menuItem: (
                <MenuItem
                  key='Chart'
                >
                  Chart
                </MenuItem>
              ),
              render: () => <TabPane attached={false}>
                Chart
              </TabPane>,
            },
          ]}
        />
      </Grid.Grid>
    </>
  );
}

export default BoundaryPaneContent;
