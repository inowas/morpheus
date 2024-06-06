import {L, LatLngExpression} from 'common/infrastructure/leafletWrapper';
import React, {useEffect, useRef} from 'react';
import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  CircleMarker as LeafletCircleMarker,
  Polygon as LeafletPolygon,
  Polyline as LeafletPolyline,
  Popup as LeafletPopup,
  useMap
} from 'react-leaflet';
import {GeomanControls, IMapRef, Map} from 'common/components/Map';
import {MapRef} from 'common/components/Map/Map';
import {ISpatialDiscretization} from '../../../types';
import {IBoundary, IBoundaryId, IBoundaryType, IObservationId} from "../../../types/Boundaries.type";
import {LineString, Point, Polygon} from "geojson";
import {LeafletEventHandlerFnMap} from "leaflet";

export interface ISelectedBoundary {
  boundary: IBoundary;
  observationId?: IObservationId;
}

interface IProps {
  boundaries: IBoundary[];
  spatialDiscretization: ISpatialDiscretization;
  addBoundary: IBoundaryType | null;
  onAddBoundary: (type: IBoundaryType, geometry: Point | Polygon | LineString) => void;
  onChangeBoundaryGeometry: (boundaryId: IBoundaryId, geometry: Point | Polygon | LineString) => void;
  onChangeBoundaryObservationGeometry: (boundaryId: IBoundaryId, observationId: IObservationId, geometry: Point) => void;
  mapRef: IMapRef;
  selectedBoundary?: ISelectedBoundary;
  isReadOnly: boolean;
}

interface LeafletEventHandlers extends LeafletEventHandlerFnMap {
  'pm:update'?: (e: any) => void;
}

const isPointBoundary = (boundaryType: IBoundaryType | null) => {
  return boundaryType === 'well';
}

const isLineBoundary = (boundaryType: IBoundaryType | null) => {
  if (!boundaryType) {
    return false;
  }
  return ['constant_head', 'drain', 'flow_and_head', 'general_head', 'river'].includes(boundaryType);
}

const isPolygonBoundary = (boundaryType: IBoundaryType | null) => {
  if (!boundaryType) {
    return false;
  }
  return ['recharge', 'evapotranspiration', 'lake'].includes(boundaryType);
}

const handleSelectBoundary = (boundaryId: IBoundaryId) => {
  console.log('click', boundaryId);
}

const BoundariesMap = ({
                         boundaries,
                         spatialDiscretization,
                         addBoundary,
                         onAddBoundary,
                         onChangeBoundaryGeometry,
                         onChangeBoundaryObservationGeometry,
                         selectedBoundary,
                         isReadOnly,
                       }: IProps) => {

    const map = useMap();

    // onCreate handler is executed multiple times for the same layer, so we need to store the leaflet ids as reference
    // this is an ugly workaround, I have opened an issue in the geoman-react repository
    const alreadyAddedLayerIds = useRef<number[]>([]);

    // as it is not possible to pass the boundary type to the onCreate event, we need to store it in a ref
    const addBoundaryType = useRef<IBoundaryType | null>(null);

    useEffect(() => {
      if (!spatialDiscretization) {
        return;
      }

      const layer = L.geoJSON(spatialDiscretization.geometry);
      map.fitBounds(layer.getBounds());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spatialDiscretization.geometry]);

    useEffect(() => {
      if (!addBoundary) {
        return;
      }

      addBoundaryType.current = addBoundary;

      if (isPointBoundary(addBoundary)) {
        map.pm.enableDraw('Marker', {
          snappable: true,
          snapDistance: 20,
          cursorMarker: true,
        });
      }

      if (isLineBoundary(addBoundary)) {
        map.pm.enableDraw('Line', {
          snappable: true,
          snapDistance: 20,
          cursorMarker: true,
        });
      }

      if (isPolygonBoundary(addBoundary)) {
        map.pm.enableDraw('Polygon', {
          snappable: true,
          snapDistance: 20,
          cursorMarker: true,
        });
      }

      map.pm.getGeomanLayers().forEach((layer) => {
        layer.remove();
      })

    }, [addBoundary]);

    const handleCreate = (e: any) => {

      const layer = e.layer;
      const leafletId = layer?._leaflet_id;

      if (addBoundaryType.current === null) {
        return;
      }

      // there is a strange behavior with geoman that triggers the onCreate event multiple times
      // for the same layer. This is a workaround to prevent adding the same layer multiple times
      if (!leafletId || alreadyAddedLayerIds.current.includes(leafletId)) {
        return;
      }

      // Attention: L.Polygon is inherited from L.Polyline
      // Because of this, the order of the if statements is important !!
      if (layer instanceof L.Polygon) {
        layer.pm.disable();
        const latLngs = layer.getLatLngs() as L.LatLng[][];
        const newGeometry: Polygon = {
          type: 'Polygon',
          coordinates: latLngs.map((latLng) => latLng.map((ll) => [ll.lng, ll.lat])),
        };

        onAddBoundary(addBoundaryType.current, newGeometry);
        alreadyAddedLayerIds.current.push(leafletId);
        return;
      }

      if (layer instanceof L.Polyline) {
        layer.pm.disable();
        const latLngs = layer.getLatLngs() as L.LatLng[];
        const newGeometry: LineString = {
          type: 'LineString',
          coordinates: latLngs.map((ll) => [ll.lng, ll.lat]),
        };
        onAddBoundary(addBoundaryType.current, newGeometry);
        alreadyAddedLayerIds.current.push(leafletId);
        return;
      }

      if (layer instanceof L.Marker) {
        layer.pm.disable();
        const latLng = layer.getLatLng() as L.LatLng;
        const newGeometry: Point = {
          type: 'Point',
          coordinates: [latLng.lng, latLng.lat],
        };
        onAddBoundary(addBoundaryType.current, newGeometry);
        alreadyAddedLayerIds.current.push(leafletId);
        return;
      }
    };

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
    }

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
    }

    const renderAddBoundary = () => {
      if (!addBoundary) {
        return null;
      }

      return (
        <FeatureGroup>
          <GeomanControls
            key={addBoundary}
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
              editMode: false,
              dragMode: false,
              rotateMode: false,
              removalMode: false,
            }}
            globalOptions={{
              continueDrawing: false,
              editable: false,
              draggable: false,
            }}
            onCreate={handleCreate}
          />
        </FeatureGroup>
      )
    }

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
      )
    }

    const renderBoundariesByType = (boundaries: IBoundary[], boundaryType: IBoundaryType) => {
      const filteredBoundaries = boundaries.filter((b) => b.type === boundaryType);
      if (!filteredBoundaries.length) {
        return null;
      }

      return (
        <LayersControl.Overlay checked={true} key={boundaryType} name={boundaryType}>
          <LayerGroup>
            {filteredBoundaries.map((boundary) => {
              const isGlobalEditMode = selectedBoundary && !isReadOnly;
              const isViewMode = !isGlobalEditMode;
              const isSelected = selectedBoundary && selectedBoundary.boundary.id === boundary.id;
              const isEditable = isGlobalEditMode && isSelected;
              const key = `${boundary.id}-${isSelected ? 'selected' : 'not_selected'}-${isEditable ? 'edit' : ''}`;

              const viewModeEventHandlers: LeafletEventHandlers = {click: () => handleSelectBoundary(boundary.id), mouseover: (event: any) => event.target.openPopup()}
              const editBoundaryEventHandlers: LeafletEventHandlers = {'pm:update': handleChangeBoundaryGeometry(boundary.id)}

              if (isPointBoundary(boundary.type)) {
                const geometry = boundary.geometry as Point;
                const position = [geometry.coordinates[1], geometry.coordinates[0]] as LatLngExpression;

                return (
                  <FeatureGroup key={`${key}-group`}>
                    <LeafletCircleMarker
                      key={key}
                      center={position}
                      radius={isSelected ? 10 : 5}
                      fill={true}
                      fillOpacity={isSelected ? 1 : 0.5}
                      color={isSelected ? 'red' : 'blue'}
                      eventHandlers={isViewMode ? viewModeEventHandlers : isEditable ? editBoundaryEventHandlers : {}}
                      pmIgnore={!isEditable}
                    >
                      <LeafletPopup>
                        {boundary.name}
                      </LeafletPopup>
                    </LeafletCircleMarker>
                  </FeatureGroup>
                )
              }

              if (isLineBoundary(boundary.type)) {
                const lineGeometry = boundary.geometry as LineString;
                const linePositions = lineGeometry.coordinates.map((c) => [c[1], c[0]]) as LatLngExpression[];
                return (
                  <FeatureGroup key={`${key}-group`}>
                    <LeafletPolyline
                      key={key}
                      positions={linePositions}
                      weight={isSelected ? 3 : 1.5}
                      eventHandlers={isViewMode ? viewModeEventHandlers : isEditable ? editBoundaryEventHandlers : {}}
                      color={isSelected ? 'red' : 'blue'}
                      pmIgnore={!isEditable}
                    >
                      <LeafletPopup>
                        {boundary.name}
                      </LeafletPopup>
                    </LeafletPolyline>

                    {boundary.observations.map((observation) => {
                      const isSelectedObservation = selectedBoundary && selectedBoundary.observationId === observation.observation_id;
                      const keyObservation = `${observation.observation_id}-${isSelectedObservation ? 'selected' : 'not_selected'}-${isEditable ? 'edit' : 'view'}`;
                      const geometry = observation.geometry as Point;
                      const position = [geometry.coordinates[1], geometry.coordinates[0]] as LatLngExpression;
                      const editBoundaryObservationEventHandlers: LeafletEventHandlers = {'pm:update': handleChangeBoundaryObservationPointGeometry(boundary.id, observation.observation_id)}
                      return (
                        <LeafletCircleMarker
                          key={`${keyObservation}`}
                          center={position}
                          radius={isSelectedObservation ? 10 : 5}
                          fill={true}
                          fillOpacity={isSelectedObservation ? 1 : 0.5}
                          eventHandlers={isViewMode ? viewModeEventHandlers : isEditable ? editBoundaryObservationEventHandlers : {}}
                          color={isSelectedObservation ? 'red' : 'blue'}
                          pmIgnore={!isSelectedObservation}
                        >
                          <LeafletPopup>
                            {observation.observation_name}
                          </LeafletPopup>
                        </LeafletCircleMarker>
                      )
                    })}
                  </FeatureGroup>
                )
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
                      weight={isSelected ? 3 : 1.5}
                      fillOpacity={1}
                      eventHandlers={isViewMode ? viewModeEventHandlers : isEditable ? editBoundaryEventHandlers : {}}
                      color={isSelected ? 'red' : 'blue'}
                      pmIgnore={!isEditable}
                    >
                      <LeafletPopup>
                        {boundary.name}
                      </LeafletPopup>
                    </LeafletPolygon>
                  </FeatureGroup>
                )
              }
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      )
    }

    const renderEditBoundary = () => {
      if (isReadOnly || !selectedBoundary) {
        return null;
      }

      return (
        <FeatureGroup>
          <GeomanControls
            key={`edit-${selectedBoundary.boundary.id}-${selectedBoundary.observationId ? 'observation' : 'boundary'}`}
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
              maxRadiusCircleMarker: 50,
              minRadiusCircleMarker: 50,
              draggable: true,
            }}
          />
        </FeatureGroup>
      )
    }

    const renderSpatialDiscretization = () => {
      if (!spatialDiscretization) {
        return null;
      }

      return (
        <LeafletPolygon
          pmIgnore={true}
          positions={spatialDiscretization.geometry.coordinates[0].map((c) => [c[1], c[0]])}
          fill={false}
          weight={1.5}
        />
      );
    }

    return (
      <FeatureGroup>
        {renderAddBoundary()}
        {renderBoundaries()}
        {renderEditBoundary()}
        {renderSpatialDiscretization()}
      </FeatureGroup>
    );
  }
;

const BoundariesMapWrapper = (props: IProps) => (
  <Map>
    <MapRef mapRef={props.mapRef}/>;
    <BoundariesMap {...props} />
  </Map>
);

export default BoundariesMapWrapper;
