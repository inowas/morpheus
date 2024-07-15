import {L, LatLngExpression} from 'common/infrastructure/Leaflet';
import React from 'react';
import objectHash from 'object-hash';
import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  CircleMarker as LeafletCircleMarker,
  Popup as LeafletPopup,
} from 'common/infrastructure/React-Leaflet';
import {GeomanControls} from 'common/components/Map';
import {Point} from 'geojson';
import {LeafletEventHandlerFnMap} from 'leaflet';
import {IHeadObservation, IObservationId, IObservationType} from '../../../types/HeadObservations.type';

interface IProps {
  observations: IHeadObservation[];
  selected?: IHeadObservation;
  onSelect: (observation: IHeadObservation) => void;
  onChange: (observation: IHeadObservation) => void;
  isReadOnly: boolean;
}

interface LeafletEventHandlers extends LeafletEventHandlerFnMap {
  'pm:update'?: (e: any) => void;
}

const ObservationsLayer = ({
  observations,
  selected,
  onSelect,
  onChange,
  isReadOnly,
}: IProps) => {

  const handleChangeGeometry = (observationId: IObservationId) => (e: any) => {
    const observation = observations.find((obs) => obs.id === observationId);
    if (!observation) {
      return;
    }

    const geometry = e.layer.getLatLng() as L.LatLng;
    const newGeometry: Point = {
      type: 'Point',
      coordinates: [geometry.lng, geometry.lat],
    };
    return onChange({...observation, geometry: newGeometry});
  };

  const renderObservationsByType = (observationsToRender: IHeadObservation[], type: IObservationType) => {
    const filteredObservations = observationsToRender.filter((obs) => obs.type === type);
    if (0 === filteredObservations.length) {
      return null;
    }

    return (
      <LayersControl.Overlay
        checked={true}
        key={type}
        name={type}
      >
        <LayerGroup>
          {filteredObservations.map((observation) => {
            const isEditable = !isReadOnly && selected && selected.id === observation.id;
            const isSelected = selected && selected.id === observation.id;
            const hash = objectHash(observation.geometry);
            const key = `${observation.id}-${hash}-${isSelected ? 'selected' : 'not_selected'}-${isEditable ? 'edit' : ''}`;

            let viewModeEventHandlers: LeafletEventHandlers = {click: () => onSelect(observation)};
            const editBoundaryEventHandlers: LeafletEventHandlers = {'pm:update': handleChangeGeometry(observation.id)};

            const geometry = observation.geometry as Point;
            const position = [geometry.coordinates[1], geometry.coordinates[0]] as LatLngExpression;

            return (
              <FeatureGroup key={`${key}-group`}>
                <LeafletCircleMarker
                  key={key}
                  center={position}
                  radius={7}
                  fill={true}
                  fillOpacity={1}
                  color={isSelected ? 'blue' : 'grey'}
                  eventHandlers={isEditable ? editBoundaryEventHandlers : viewModeEventHandlers}
                  pmIgnore={!isEditable}
                >
                  <LeafletPopup>
                    {observation.name}
                  </LeafletPopup>
                </LeafletCircleMarker>
              </FeatureGroup>
            );
          })}
        </LayerGroup>
      </LayersControl.Overlay>
    );
  };

  const renderBoundaries = () => {
    if (!observations) {
      return null;
    }

    return (
      <LayersControl position="topright">
        {renderObservationsByType(observations, 'head')}
      </LayersControl>
    );
  };

  const renderEditBoundary = () => {
    if (isReadOnly || !selected) {
      return null;
    }

    return (
      <FeatureGroup>
        <GeomanControls
          key={`edit-${selected.id}-'observation'}`}
          options={{
            position: 'topleft',
            drawText: false,
            drawMarker: false,
            drawCircle: false,
            cutPolygon: false,
            drawRectangle: false,
            drawPolygon: false,
            drawCircleMarker: false,
            drawPolyline: false,
            editMode: true,
            editControls: true,
            dragMode: false,
            rotateMode: false,
            removalMode: false,
          }}
          globalOptions={{
            allowSelfIntersection: true,
            allowSelfIntersectionEdit: true,
            allowEditing: true,
            allowRemoval: false,
            allowRotation: false,
            preventMarkerRemoval: true,
            continueDrawing: false,
            editable: true,
            maxRadiusCircleMarker: 10,
            minRadiusCircleMarker: 10,
            draggable: true,
          }}
        />
      </FeatureGroup>
    );
  };

  return (
    <FeatureGroup>
      {renderBoundaries()}
      {renderEditBoundary()}
    </FeatureGroup>
  );
};


export default ObservationsLayer;
