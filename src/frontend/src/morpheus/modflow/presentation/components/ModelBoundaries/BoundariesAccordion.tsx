import React from "react";
import BoundariesAccordionPane from "./BoundariesAccordionPane";
import {Accordion} from "common/components";
import {availableBoundaries, IBoundary, IBoundaryId, IBoundaryType, IObservation, IObservationId, ISelectedBoundaryAndObservation} from "../../../types/Boundaries.type";
import {ILayer, ILayerId} from "../../../types/Layers.type";
import {ITimeDiscretization} from "../../../types";

interface IPanelDetails {
  title: string;
  type: IBoundaryType;
  boundaries: IBoundary[];
  active: boolean;
}

const getPanelDetails = (boundaries: IBoundary[], selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation): IPanelDetails[] => availableBoundaries.map((b) => ({
  title: b.title,
  type: b.type,
  boundaries: boundaries.filter((boundary) => boundary.type === b.type),
  active: !!(selectedBoundaryAndObservation && selectedBoundaryAndObservation.boundary.type === b.type)
})).filter((panel) => 0 < panel.boundaries.length)

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onSelectBoundaryAndObservation: (selectedBoundaryAndObservation: ISelectedBoundaryAndObservation) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onCloneBoundaryObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundary_name?: string, boundary_tags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  onRemoveBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onRemoveBoundaryObservation: (boundaryId: IBoundaryId, observationId: IObservationId) => Promise<void>;
  timeDiscretization: ITimeDiscretization;
}

const BoundariesAccordion = ({
                               boundaries,
                               layers,
                               selectedBoundaryAndObservation,
                               onCloneBoundary,
                               onCloneBoundaryObservation,
                               onUpdateBoundaryAffectedLayers,
                               onUpdateBoundaryMetadata,
                               onUpdateBoundaryObservation,
                               onRemoveBoundary,
                               onRemoveBoundaryObservation,
                               onSelectBoundaryAndObservation,
                               timeDiscretization
                             }: IProps) => {
  const panelDetails = getPanelDetails(boundaries, selectedBoundaryAndObservation);

  const handlePanelChange = (panel: IPanelDetails) => {
    if (!panel.boundaries.length) {
      return;
    }

    const firstBoundary = panel.boundaries[0];
    if (firstBoundary.type === selectedBoundaryAndObservation?.boundary.type) {
      return;
    }

    onSelectBoundaryAndObservation({boundary: firstBoundary});
  }

  return (
    <Accordion
      defaultActiveIndex={panelDetails.findIndex((panel) => panel.active)}
      className='accordionPrimary'
      exclusive={true}
      panels={panelDetails.map((panel) => ({
        key: panel.type,
        title: {
          content: <span>{`${panel.title} (${panel.boundaries.length})`}</span>,
          icon: false,
          onClick: () => handlePanelChange(panel)
        },
        active: panel.active,
        content: {
          content: (
            <BoundariesAccordionPane
              boundaries={panel.boundaries}
              boundaryType={panel.type}
              onCloneBoundary={onCloneBoundary}
              onCloneBoundaryObservation={onCloneBoundaryObservation}
              onRemoveBoundary={onRemoveBoundary}
              onRemoveBoundaryObservation={onRemoveBoundaryObservation}
              onUpdateBoundaryMetadata={onUpdateBoundaryMetadata}
              onUpdateBoundaryAffectedLayers={onUpdateBoundaryAffectedLayers}
              onUpdateBoundaryObservation={onUpdateBoundaryObservation}
              selectedBoundaryAndObservation={selectedBoundaryAndObservation?.boundary?.type === panel.type ? selectedBoundaryAndObservation : undefined}
              onSelectBoundaryAndObservation={onSelectBoundaryAndObservation}
              isReadOnly={false}
              layers={layers}
              timeDiscretization={timeDiscretization}
            />
          ),
        }
      }))}
    />
  );
}

export default BoundariesAccordion;
