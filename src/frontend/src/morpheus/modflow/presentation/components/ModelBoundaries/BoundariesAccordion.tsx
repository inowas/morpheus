import React from 'react';
import BoundariesAccordionPane from './BoundariesAccordionPane';
import {Accordion} from 'common/components';
import {
  IBoundary,
  IBoundaryId,
  IBoundaryType,
  IInterpolationType,
  IObservation,
  IObservationId,
  ISelectedBoundaryAndObservation,
} from '../../../types/Boundaries.type';
import {ILayer, ILayerId} from '../../../types/Layers.type';
import {ITimeDiscretization} from '../../../types';
import {boundarySettings} from './helpers';

interface IPanelDetails {
  title: string;
  type: IBoundaryType;
  boundaries: IBoundary[];
  active: boolean;
}

const getPanelDetails = (boundaries: IBoundary[], selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation): IPanelDetails[] => boundarySettings.map((b) => ({
  title: b.title,
  type: b.type,
  boundaries: boundaries.filter((boundary) => boundary.type === b.type),
  active: selectedBoundaryAndObservation && selectedBoundaryAndObservation.boundary.type === b.type || false,
})).filter((panel) => 0 < panel.boundaries.length);

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  formatDateTime: (value: string) => string;
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onSelectBoundaryAndObservation: (selectedBoundaryAndObservation: ISelectedBoundaryAndObservation | null) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onCloneBoundaryObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  onDisableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onEnableBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryIds: IBoundaryId[], affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryInterpolation: (boundaryIds: IBoundaryId[], interpolation: IInterpolationType) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundary_name?: string, boundary_tags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  onUpdateBoundaryTags: (boundaryIds: IBoundaryId[], boundaryTags: string[]) => Promise<void>;
  onRemoveBoundaries: (boundaryIds: IBoundaryId[]) => Promise<void>;
  onRemoveBoundaryObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  timeDiscretization: ITimeDiscretization;
}

const BoundariesAccordion = ({
  boundaries,
  layers,
  formatDateTime,
  selectedBoundaryAndObservation,
  onCloneBoundary,
  onCloneBoundaryObservation,
  onDisableBoundary,
  onEnableBoundary,
  onUpdateBoundaryAffectedLayers,
  onUpdateBoundaryInterpolation,
  onUpdateBoundaryMetadata,
  onUpdateBoundaryObservation,
  onUpdateBoundaryTags,
  onRemoveBoundaries,
  onRemoveBoundaryObservation,
  onSelectBoundaryAndObservation,
  timeDiscretization,
}: IProps) => {

  const panelDetails = getPanelDetails(boundaries, selectedBoundaryAndObservation);

  const handlePanelChange = (panel: IPanelDetails) => {
    if (panel.active) {
      return onSelectBoundaryAndObservation(null);
    }

    if (!panel.boundaries.length) {
      return onSelectBoundaryAndObservation(null);
    }

    const firstBoundary = panel.boundaries[0];
    if (firstBoundary.type === selectedBoundaryAndObservation?.boundary.type) {
      return;
    }

    onSelectBoundaryAndObservation({boundary: firstBoundary, observationId: firstBoundary.observations[0].observation_id});
  };

  return (
    <Accordion
      className='accordionPrimary'
      exclusive={true}
      panels={panelDetails.map((panel) => ({
        key: panel.type,
        title: {
          content: <span>{`${panel.title} (${panel.boundaries.length})`}</span>,
          icon: false,
          onClick: () => handlePanelChange(panel),
        },
        active: panel.active,
        content: {
          content: (
            <BoundariesAccordionPane
              boundaries={panel.boundaries}
              boundaryType={panel.type}
              onCloneBoundary={onCloneBoundary}
              onCloneBoundaryObservation={onCloneBoundaryObservation}
              onDisableBoundary={onDisableBoundary}
              onEnableBoundary={onEnableBoundary}
              onRemoveBoundaries={onRemoveBoundaries}
              onRemoveBoundaryObservation={onRemoveBoundaryObservation}
              onUpdateBoundaryMetadata={onUpdateBoundaryMetadata}
              onUpdateBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
              onUpdateBoundaryInterpolation={onUpdateBoundaryInterpolation}
              onUpdateBoundaryObservation={onUpdateBoundaryObservation}
              onUpdateBoundaryTags={onUpdateBoundaryTags}
              selectedBoundaryAndObservation={selectedBoundaryAndObservation?.boundary?.type === panel.type ? selectedBoundaryAndObservation : undefined}
              onSelectBoundaryAndObservation={onSelectBoundaryAndObservation}
              isReadOnly={false}
              layers={layers}
              timeDiscretization={timeDiscretization}
              formatDateTime={formatDateTime}
            />
          ),
        },
      }))}
    />
  );
};

export default BoundariesAccordion;
