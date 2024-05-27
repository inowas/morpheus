import React from 'react';
import {IBoundary, IBoundaryId, IBoundaryType, IObservationId} from "../../../types/Boundaries.type";
import BoundaryList from "./BoundaryList";
import {Grid, InfoTitle, Tab} from 'common/components';
import {useDateTimeFormat} from "common/hooks";

import {BoundariesForm} from "../BoundariesLayers/BoundariesForm";
import {MenuItem, TabPane} from "semantic-ui-react";
import {BoundariesTable} from "../BoundariesLayers/BoundariesTable";
import {ILayer} from "../../../types/Layers.type";
import {ISelectedBoundary} from "./types/SelectedBoundary.type";

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  type: IBoundaryType;
  selectedBoundary?: ISelectedBoundary;
  onChangeSelectedBoundary: (selectedBoundary: ISelectedBoundary) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => void;
  onRemoveBoundary: (boundaryId: IBoundaryId) => void;
  onUpdateBoundary: (boundary: IBoundary) => void;
  timeZone?: string;
  isReadOnly: boolean;
}

const BoundariesAccordionPane = ({
                                   type,
                                   boundaries,
                                   layers,
                                   selectedBoundary,
                                   onChangeSelectedBoundary,
                                   onCloneBoundary,
                                   onRemoveBoundary,
                                   onUpdateBoundary,
                                   timeZone,
                                   isReadOnly
                                 }: IProps) => {


  const {formatISODateTime} = useDateTimeFormat(timeZone);

  const getSelectedBoundary = (): ISelectedBoundary => {
    if (selectedBoundary?.boundary.type === type) {
      return selectedBoundary;
    }

    return {
      boundary: boundaries[0],
      observationId: boundaries[0].observations[0].observation_id,
    }
  }

  const handleCloneBoundary = (boundaryId: IBoundaryId) => {
    onCloneBoundary(boundaryId);
  }

  const handleCloneObservation = (boundaryId: IBoundaryId, observationId: IObservationId) => {
    console.log('Clone observation', boundaryId, observationId)
  }

  const handleUpdateBoundary = (boundary: IBoundary) => {
    onUpdateBoundary(boundary);
  }

  const handleUpdateObservation = (boundaryId: IBoundaryId, observationId: IObservationId) => {
    console.log('Update observation', boundaryId, observationId)
  }

  const handleRemoveBoundary = (boundaryId: IBoundaryId) => {
    onRemoveBoundary(boundaryId);
  }

  const handleRemoveObservation = (boundaryId: IBoundaryId, observationId: IObservationId) => {
    console.log('Remove observation', boundaryId, observationId)
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
            selectedBoundary={getSelectedBoundary()}
            onSelectBoundary={onChangeSelectedBoundary}
            onCloneBoundary={handleCloneBoundary}
            onCloneObservation={handleCloneObservation}
            onUpdateBoundary={handleUpdateBoundary}
            onUpdateObservation={handleUpdateObservation}
            onRemoveBoundary={handleRemoveBoundary}
            onRemoveObservation={handleRemoveObservation}
            isReadOnly={isReadOnly}
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
            boundary={getSelectedBoundary().boundary}
            onChangeBoundary={handleUpdateBoundary}
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
                <BoundariesTable
                  selectedBoundary={getSelectedBoundary()}
                  formatDateTime={formatISODateTime}
                />
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

export default BoundariesAccordionPane;
