import React, {useEffect, useState} from 'react';
import {IBoundary, IBoundaryId, IBoundaryType, IObservation, IObservationId, ISelectedBoundaryAndObservation} from "../../../types/Boundaries.type";
import BoundaryList from "./BoundaryList";
import {Grid, InfoTitle, Tab} from 'common/components';

import {BoundariesForm} from "../BoundariesLayers/BoundariesForm";
import {MenuItem, TabPane} from "semantic-ui-react";
import {ObservationDataTable} from "../BoundariesLayers/BoundariesTable";
import {ILayer, ILayerId} from "../../../types/Layers.type";
import ObservationDataChart from "../BoundariesLayers/BoundariesTable/ObservationDataChart";
import {ITimeDiscretization} from "../../../types";

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  boundaryType: IBoundaryType;
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onSelectBoundaryAndObservation: (selectedBoundaryAndObservation: ISelectedBoundaryAndObservation) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onRemoveBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundary_name?: string, boundary_tags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  timeDiscretization: ITimeDiscretization;
  isReadOnly: boolean;
}

const BoundariesAccordionPane = ({
                                   boundaryType,
                                   boundaries,
                                   layers,
                                   selectedBoundaryAndObservation,
                                   onSelectBoundaryAndObservation,
                                   onCloneBoundary,
                                   onRemoveBoundary,
                                   onUpdateBoundaryAffectedLayers,
                                   onUpdateBoundaryMetadata,
                                   onUpdateBoundaryObservation,
                                   isReadOnly,
                                   timeDiscretization,
                                 }: IProps) => {

  const [selectedBoundary, setSelectedBoundary] = useState<IBoundary | undefined>(undefined);
  const [selectedBoundaryObservation, setSelectedBoundaryObservation] = useState<IObservation<any> | undefined>(undefined);

  useEffect(() => {
    const boundary = boundaries.find((b) => b.id === selectedBoundaryAndObservation?.boundary.id);
    if (boundary) {
      setSelectedBoundary(boundary);
      const observation = boundary.observations.find((o) => o.observation_id === selectedBoundaryAndObservation?.observationId);
      if (observation) {
        return setSelectedBoundaryObservation(observation);
      }
      return setSelectedBoundaryObservation(boundary.observations[0]);
    }


    setSelectedBoundary(boundaries[0]);
    setSelectedBoundaryObservation(boundaries[0].observations[0]);

  }, [selectedBoundaryAndObservation, boundaries]);

  const handleCloneObservation = async (boundaryId: IBoundaryId, observationId: IObservationId) => {
    // add observation to boundary
  }
  const handleChangeBoundaryName = (boundaryId: IBoundaryId, boundary_name: string) => onUpdateBoundaryMetadata(boundaryId, boundary_name);
  const handleChangeBoundaryTags = (boundaryId: IBoundaryId, boundaryTags: string[]) => onUpdateBoundaryMetadata(boundaryId, undefined, boundaryTags);
  const handleChangeBoundaryAffectedLayers = (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => onUpdateBoundaryAffectedLayers(boundaryId, affectedLayers);
  const handleRemoveObservation = async (boundaryId: IBoundaryId, observationId: IObservationId) => {
    console.log('Remove observation', boundaryId, observationId)
  }

  if (!selectedBoundary || !selectedBoundaryObservation) {
    return null;
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
            boundaries={boundaries}
            isReadOnly={isReadOnly}
            selectedBoundaryAndObservation={{boundary: selectedBoundary, observationId: selectedBoundaryObservation.observation_id}}
            type={boundaryType}
            onChangeBoundaryName={handleChangeBoundaryName}
            onSelectBoundaryAndObservation={onSelectBoundaryAndObservation}
            onCloneBoundary={onCloneBoundary}
            onCloneObservation={handleCloneObservation}
            onRemoveBoundary={onRemoveBoundary}
            onRemoveObservation={handleRemoveObservation}
            onUpdateObservation={onUpdateBoundaryObservation}
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
            boundary={selectedBoundary}
            onChangeBoundaryTags={handleChangeBoundaryTags}
            onChangeBoundaryAffectedLayers={handleChangeBoundaryAffectedLayers}
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
                <ObservationDataTable
                  boundaryType={boundaryType}
                  observation={selectedBoundaryObservation}
                  onChangeObservation={(observation: IObservation<any>) => onUpdateBoundaryObservation(selectedBoundary.id, boundaryType, observation)}
                />
              </TabPane>,
            },
            {
              menuItem: <MenuItem key='Chart'>Chart</MenuItem>,
              render: () => <TabPane attached={false}>
                <ObservationDataChart observation={selectedBoundaryObservation} timeDiscretization={timeDiscretization}/>
              </TabPane>,
            },
          ]}
        />
      </Grid.Grid>
    </>
  );
}

export default BoundariesAccordionPane;
