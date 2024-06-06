import React from "react";
import BoundariesAccordionPane from "./BoundariesAccordionPane";
import {Accordion} from "common/components";
import {availableBoundaries, IBoundary, IBoundaryId, IBoundaryType, IObservation, ISelectedBoundaryAndObservation} from "../../../types/Boundaries.type";
import {ILayer, ILayerId} from "../../../types/Layers.type";
import {ITimeDiscretization} from "../../../types";

const getPanelDetails = (boundaries: IBoundary[], selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation) => availableBoundaries.map((b) => ({
  title: b.title,
  type: b.type,
  boundaries: boundaries.filter((boundary) => boundary.type === b.type),
  active: selectedBoundaryAndObservation && selectedBoundaryAndObservation.boundary.type === b.type
})).filter((panel) => 0 < panel.boundaries.length)

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onSelectBoundaryAndObservation: (selectedBoundaryAndObservation: ISelectedBoundaryAndObservation) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  onUpdateBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onUpdateBoundaryMetadata: (boundaryId: IBoundaryId, boundary_name?: string, boundary_tags?: string[]) => Promise<void>;
  onUpdateBoundaryObservation: (boundaryId: IBoundaryId, boundaryType: IBoundaryType, observation: IObservation<any>) => Promise<void>;
  onRemoveBoundary: (boundaryId: IBoundaryId) => Promise<void>;
  timeDiscretization: ITimeDiscretization;
}

const BoundariesAccordion = ({
                               boundaries,
                               layers,
                               selectedBoundaryAndObservation,
                               onCloneBoundary,
                               onUpdateBoundaryAffectedLayers,
                               onUpdateBoundaryMetadata,
                               onUpdateBoundaryObservation,
                               onRemoveBoundary,
                               onSelectBoundaryAndObservation,
                               timeDiscretization
                             }: IProps) => {
  const panelDetails = getPanelDetails(boundaries, selectedBoundaryAndObservation);

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
        },
        content: {
          content: (
            <BoundariesAccordionPane
              boundaries={panel.boundaries}
              boundaryType={panel.type}
              onCloneBoundary={onCloneBoundary}
              onRemoveBoundary={onRemoveBoundary}
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
