import {L, LatLngExpression} from 'common/infrastructure/Leaflet';
import React from 'react';
import objectHash from 'object-hash';
import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  CircleMarker as LeafletCircleMarker,
  Polygon as LeafletPolygon,
  Polyline as LeafletPolyline,
  Popup as LeafletPopup,
} from 'common/infrastructure/React-Leaflet';
import {GeomanControls} from 'common/components/Map';
import {IBoundary, IBoundaryId, IBoundaryType, IObservationId, ISelectedBoundaryAndObservation} from '../../../types/Boundaries.type';
import {LineString, Point, Polygon} from 'geojson';
import {LeafletEventHandlerFnMap} from 'leaflet';

interface IProps {
  boundaries: IBoundary[];
  checkedBoundaries: IBoundaryId[];
  selectedBoundaryAndObservation?: ISelectedBoundaryAndObservation;
  onSelectBoundaryAndObservation: (selectedBoundary: ISelectedBoundaryAndObservation) => void;
  onChangeBoundaryGeometry: (boundaryId: IBoundaryId, geometry: Point | LineString | Polygon) => void;
  onChangeBoundaryObservationGeometry: (boundaryId: IBoundaryId, observationId: IObservationId, geometry: Point) => void;
  isReadOnly: boolean;
}

interface LeafletEventHandlers extends LeafletEventHandlerFnMap {
  'pm:update'?: (e: any) => void;
}

const isPointBoundary = (boundaryType: IBoundaryType | null) => {
  return 'well' === boundaryType;
};

const isLineBoundary = (boundaryType: IBoundaryType | null) => {
  if (!boundaryType) {
    return false;
  }
  return ['constant_head', 'drain', 'flow_and_head', 'general_head', 'river'].includes(boundaryType);
};

const isPolygonBoundary = (boundaryType: IBoundaryType | null) => {
  if (!boundaryType) {
    return false;
  }
  return ['recharge', 'evapotranspiration', 'lake'].includes(boundaryType);
};
const BoundariesLayer = ({
  boundaries,
  checkedBoundaries,
  selectedBoundaryAndObservation,
  onSelectBoundaryAndObservation,
  onChangeBoundaryGeometry,
  onChangeBoundaryObservationGeometry,
  isReadOnly,
}: IProps) => {

  const handleChangeBoundaryGeometry = (boundaryId: IBoundaryId) => (e: any) => {
    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (!boundary) {
      return;
    }

    if (isPointBoundary(boundary.type)) {
      const geometry = e.layer.getLatLng() as L.LatLng;
      const newGeometry: Point = {
        type: 'Point',
        coordinates: [geometry.lng, geometry.lat],
      };
      onChangeBoundaryGeometry(boundaryId, newGeometry);
      return;
    }

    if (isLineBoundary(boundary.type)) {
      const latLngs = e.layer.getLatLngs() as L.LatLng[];
      const newGeometry: LineString = {
        type: 'LineString',
        coordinates: latLngs.map((ll) => [ll.lng, ll.lat]),
      };
      onChangeBoundaryGeometry(boundaryId, newGeometry);
      return;
    }

    if (isPolygonBoundary(boundary.type)) {
      const latLngs = e.layer.getLatLngs() as L.LatLng[][];
      const newGeometry: Polygon = {
        type: 'Polygon',
        coordinates: latLngs.map((latLng) => latLng.map((ll) => [ll.lng, ll.lat])),
      };
      onChangeBoundaryGeometry(boundaryId, newGeometry);
      return;
    }
  };

  const handleChangeBoundaryObservationPointGeometry = (boundaryId: IBoundaryId, observationId: IObservationId) => (e: any) => {
    const boundary = boundaries.find((b) => b.id === boundaryId);
    if (!boundary) {
      return;
    }

    const observation = boundary.observations.find((o) => o.observation_id === observationId);
    if (!observation) {
      return;
    }

    const geometry = e.layer.getLatLng() as L.LatLng;
    const newGeometry: Point = {
      type: 'Point',
      coordinates: [geometry.lng, geometry.lat],
    };

    onChangeBoundaryObservationGeometry(boundaryId, observationId, newGeometry);
  };

  const handleSelectBoundary = (boundary: IBoundary, observationId?: IObservationId) => onSelectBoundaryAndObservation({boundary, observationId});

  const renderBoundariesByType = (boundariesToRender: IBoundary[], boundaryType: IBoundaryType) => {
    const filteredBoundaries = boundariesToRender.filter((b) => b.type === boundaryType);
    if (!filteredBoundaries.length) {
      return null;
    }

    return (
      <LayersControl.Overlay
        checked={true} key={boundaryType}
        name={boundaryType}
      >
        <LayerGroup>
          {filteredBoundaries.map((boundary) => {
            const isEditable = !isReadOnly && ((selectedBoundaryAndObservation && selectedBoundaryAndObservation.boundary.id === boundary.id) || (checkedBoundaries.includes(boundary.id)));
            const isSelected = selectedBoundaryAndObservation && selectedBoundaryAndObservation.boundary.id === boundary.id || checkedBoundaries.includes(boundary.id);
            const hash = objectHash(boundary.geometry);
            const key = `${boundary.id}-${hash}-${isSelected ? 'selected' : 'not_selected'}-${isEditable ? 'edit' : ''}`;

            let viewModeEventHandlers: LeafletEventHandlers = {click: () => handleSelectBoundary(boundary)};
            const editBoundaryEventHandlers: LeafletEventHandlers = {'pm:update': handleChangeBoundaryGeometry(boundary.id)};

            if (isPointBoundary(boundary.type)) {
              const geometry = boundary.geometry as Point;
              const position = [geometry.coordinates[1], geometry.coordinates[0]] as LatLngExpression;

              return (
                <FeatureGroup key={`${key}-group`}>
                  <LeafletCircleMarker
                    key={key}
                    center={position}
                    radius={3}
                    fill={true}
                    fillOpacity={1}
                    color={isSelected ? 'black' : '#009fe3'}
                    eventHandlers={isEditable ? editBoundaryEventHandlers : viewModeEventHandlers}
                    pmIgnore={!isEditable}
                  >
                    <LeafletPopup>
                      {boundary.name}
                    </LeafletPopup>
                  </LeafletCircleMarker>
                </FeatureGroup>
              );
            }

            if (isLineBoundary(boundary.type)) {
              const lineGeometry = boundary.geometry as LineString;
              const linePositions = lineGeometry.coordinates.map((c) => [c[1], c[0]]) as LatLngExpression[];
              return (
                <FeatureGroup key={`${key}-group`}>
                  <LeafletPolyline
                    key={key}
                    positions={linePositions}
                    weight={3}
                    eventHandlers={isEditable ? editBoundaryEventHandlers : viewModeEventHandlers}
                    color={isSelected ? 'blue' : 'grey'}
                    pmIgnore={!isEditable}
                  >
                    <LeafletPopup>
                      {boundary.name}
                    </LeafletPopup>
                  </LeafletPolyline>

                  {boundary.observations.map((observation) => {
                    const isSelectedObservation = selectedBoundaryAndObservation && selectedBoundaryAndObservation.observationId === observation.observation_id;
                    const keyObservation = `${observation.observation_id}-${isSelectedObservation ? 'selected' : 'not_selected'}-${isEditable ? 'edit' : 'view'}`;
                    const geometry = observation.geometry as Point;
                    const position = [geometry.coordinates[1], geometry.coordinates[0]] as LatLngExpression;
                    const editBoundaryObservationEventHandlers: LeafletEventHandlers = {
                      'pm:update': handleChangeBoundaryObservationPointGeometry(boundary.id, observation.observation_id),
                      'click': () => handleSelectBoundary(boundary, observation.observation_id),
                    };

                    if (!isEditable) {
                      return;
                    }

                    return (
                      <LeafletCircleMarker
                        key={`${keyObservation}`}
                        center={position}
                        radius={7}
                        fill={true}
                        fillOpacity={1}
                        eventHandlers={isEditable ? editBoundaryObservationEventHandlers : viewModeEventHandlers}
                        color={isSelectedObservation ? 'blue' : 'grey'}
                        pmIgnore={!isSelectedObservation}
                      >
                        <LeafletPopup>
                          {observation.observation_name}
                        </LeafletPopup>
                      </LeafletCircleMarker>
                    );
                  })}
                </FeatureGroup>
              );
            }

            if (isPolygonBoundary(boundary.type)) {
              const geometry = boundary.geometry as Polygon;
              const positions = geometry.coordinates[0].map((c) => [c[1], c[0]]) as LatLngExpression[];
              return (
                <FeatureGroup key={`${key}-group`}>
                  <LeafletPolygon
                    key={key}
                    positions={positions}
                    fill={isSelected}
                    weight={2}
                    fillOpacity={0.2}
                    eventHandlers={isEditable ? editBoundaryEventHandlers : viewModeEventHandlers}
                    color={isSelected ? 'blue' : 'grey'}
                    pmIgnore={!isEditable}
                  >
                    <LeafletPopup>
                      {boundary.name}
                    </LeafletPopup>
                  </LeafletPolygon>
                </FeatureGroup>
              );
            }
          })}
        </LayerGroup>
      </LayersControl.Overlay>
    );
  };

  const renderBoundaries = () => {
    if (!boundaries) {
      return null;
    }

    return (
      <LayersControl position="topright">
        {renderBoundariesByType(boundaries, 'drain')}
        {renderBoundariesByType(boundaries, 'general_head')}
        {renderBoundariesByType(boundaries, 'constant_head')}
        {renderBoundariesByType(boundaries, 'evapotranspiration')}
        {renderBoundariesByType(boundaries, 'flow_and_head')}
        {renderBoundariesByType(boundaries, 'lake')}
        {renderBoundariesByType(boundaries, 'recharge')}
        {renderBoundariesByType(boundaries, 'river')}
        {renderBoundariesByType(boundaries, 'well')}
      </LayersControl>
    );
  };

  const renderEditBoundary = () => {
    if (isReadOnly || !selectedBoundaryAndObservation) {
      return null;
    }

    return (
      <FeatureGroup>
        <GeomanControls
          key={`edit-${selectedBoundaryAndObservation.boundary.id}-${selectedBoundaryAndObservation.observationId ? 'observation' : 'boundary'}`}
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


export default BoundariesLayer;
