import React from "react";
import {BoundariesAccordionPane} from "./index";
import {Accordion} from "../../../../../common/components";
import {availableBoundaries, IBoundary, IBoundaryId} from "../../../types/Boundaries.type";
import {ILayer} from "../../../types/Layers.type";
import {ISelectedBoundary} from "./types/SelectedBoundary.type";

const getPanelDetails = (boundaries: IBoundary[], selectedBoundary?: ISelectedBoundary) => availableBoundaries.map((b) => ({
  title: b.title,
  type: b.type,
  boundaries: boundaries.filter((boundary) => boundary.type === b.type),
  active: selectedBoundary && selectedBoundary.boundary.type === b.type
})).filter((panel) => 0 < panel.boundaries.length)

interface IProps {
  boundaries: IBoundary[];
  layers: ILayer[];
  selectedBoundary?: ISelectedBoundary;
  onChangeSelectedBoundary: (selectedBoundary: ISelectedBoundary) => void;
  onCloneBoundary: (boundaryId: IBoundaryId) => void;
  onRemoveBoundary: (boundaryId: IBoundaryId) => void;
  onUpdateBoundary: (boundary: IBoundary) => void;
}

const BoundariesAccordion = ({boundaries, layers, selectedBoundary, onCloneBoundary, onUpdateBoundary, onRemoveBoundary, onChangeSelectedBoundary}: IProps) => {
  const panelDetails = getPanelDetails(boundaries, selectedBoundary);

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
              type={panel.type}
              onCloneBoundary={onCloneBoundary}
              onRemoveBoundary={onRemoveBoundary}
              onUpdateBoundary={onUpdateBoundary}
              isReadOnly={false}
              layers={layers}
              selectedBoundary={selectedBoundary?.boundary.type === panel.type ? selectedBoundary : undefined}
              onChangeSelectedBoundary={onChangeSelectedBoundary}
            />
          ),
        }
      }))}
    />
  );
}

export default BoundariesAccordion;
