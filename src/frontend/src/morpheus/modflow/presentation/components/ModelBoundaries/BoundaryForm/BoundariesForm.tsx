import React, {useEffect, useState} from 'react';

import {Form, Icon, Label, Popup, DropdownItemProps} from 'semantic-ui-react';
import {Button, DataRow, DropdownComponent} from 'common/components';

import isEqual from 'lodash.isequal';
import {boundarySettings, hasMultipleAffectedLayers} from '../helpers';

import {IBoundary, IBoundaryId, IInterpolationType} from '../../../../types/Boundaries.type';
import {ILayerId} from '../../../../types/Layers.type';


interface IProps {
  availableTags: string[];
  boundaries: IBoundary[];
  onChangeBoundaryAffectedLayers: (boundaryIds: IBoundaryId[], affectedLayers: ILayerId[]) => Promise<void>;
  onChangeBoundaryInterpolation: (boundaryIds: IBoundaryId[], interpolation: IInterpolationType) => Promise<void>;
  onChangeBoundaryTags: (boundaryIds: IBoundaryId[], boundaryTags: string[]) => Promise<void>;
  layers: ILayerMetadata[];
  isReadOnly: boolean;
}

interface ILayerMetadata {
  layer_id: string;
  name: string;
}

const BoundariesForm = ({availableTags, boundaries, onChangeBoundaryAffectedLayers, onChangeBoundaryInterpolation, onChangeBoundaryTags, isReadOnly, layers}: IProps) => {

  const [tagOptions, setTagOptions] = useState<DropdownItemProps[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // If state is none, then mixed values are present and no changes will be made
  const [tags, setTags] = useState<string[] | null>(null);
  const [affectedLayers, setAffectedLayers] = useState<ILayerId[] | null>(null);
  const [interpolation, setInterpolation] = useState<IInterpolationType | null>(null);

  const hasMixedTags = () => boundaries.some(b => !isEqual(b.tags, boundaries[0].tags));
  const hasMixedAffectedLayers = () => boundaries.some(b => !isEqual(b.affected_layers, boundaries[0].affected_layers));
  const hasMixedInterpolation = () => boundaries.some(b => !isEqual(b.interpolation, boundaries[0].interpolation));

  useEffect(() => {
    setTags(null);
    setAffectedLayers(null);
    setInterpolation(null);

    if (0 === boundaries.length) {
      return;
    }

    if (!hasMixedTags()) {
      setTags(boundaries[0].tags);
    }

    if (!hasMixedAffectedLayers()) {
      setAffectedLayers(boundaries[0].affected_layers);
    }

    if (!hasMixedInterpolation()) {
      setInterpolation(boundaries[0].interpolation);
    }
  }, [boundaries, layers]);

  useEffect(() => {
    setTagOptions(availableTags.map((tag) => ({key: tag, text: tag, value: tag})) as DropdownItemProps[]);
  }, [availableTags]);


  const handleSubmit = async () => {
    setSubmitting(true);
    if (tags && (hasMixedTags() || boundaries.some(b => !isEqual(b.tags, tags)))) {
      await onChangeBoundaryTags(boundaries.map(b => b.id), tags);
    }

    if (affectedLayers && (hasMixedAffectedLayers() || boundaries.some(b => !isEqual(b.affected_layers, affectedLayers)))) {
      await onChangeBoundaryAffectedLayers(boundaries.map(b => b.id), affectedLayers);
    }

    if (interpolation && (hasMixedInterpolation() || boundaries.some(b => !isEqual(b.interpolation, interpolation)))) {
      await onChangeBoundaryInterpolation(boundaries.map(b => b.id), interpolation);
    }

    setSubmitting(false);
  };

  const getAffectedLayersValue = (bType: IBoundary['type']) => {

    if (null === affectedLayers) {
      return '';
    }

    if (hasMultipleAffectedLayers(bType)) {
      return affectedLayers;
    }

    return affectedLayers[0];
  };

  if (0 === boundaries.length) {
    return null;
  }

  const isDirty = () => {
    return (
      (tags && (hasMixedTags() || boundaries.some(b => !isEqual(b.tags, tags))) || false) ||
      (affectedLayers && (hasMixedAffectedLayers() || boundaries.some(b => !isEqual(b.affected_layers, affectedLayers))) || false) ||
      (interpolation && (hasMixedInterpolation() || boundaries.some(b => !isEqual(b.interpolation, interpolation))) || false)
    ) || false;
  };

  const boundaryType = boundaries[0].type;
  const isTimeSeriesDependent = boundarySettings.find((b) => b.type === boundaryType)?.isTimeSeriesDependent || false;

  return (
    <Form>
      <DataRow>
        <Form.Field>
          <Label
            htmlFor="selectedLayer"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Select Layer'}
              hideOnScroll={true}
              size="tiny"
            />
            Select Layer
          </Label>

          <DropdownComponent.Dropdown
            disabled={isReadOnly}
            placeholder={'Mixed Values'}
            name={'selectedLayer'}
            multiple={hasMultipleAffectedLayers(boundaryType)}
            selection={true}
            value={getAffectedLayersValue(boundaryType)}
            options={layers.map((layer) => ({
              key: layer.layer_id,
              text: layer.name,
              value: layer.layer_id,
            }))}
            onChange={(_, {value}) => {
              if (!value) {
                return;
              }

              if (!Array.isArray(value)) {
                value = [value];
              }

              setAffectedLayers(value as ILayerId[]);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label htmlFor="tags" className="labelSmall">
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Tags'}
              hideOnScroll={true}
              size="tiny"
            />
            Tags
          </Label>
          <DropdownComponent.Dropdown
            disabled={isReadOnly}
            allowAdditions={true}
            fluid={true}
            multiple={true}
            onAddItem={(_: React.SyntheticEvent<HTMLElement, Event>, data: any) => setTagOptions([...tagOptions, {key: data.value, text: data.value, value: data.value}])}
            onChange={(_: React.SyntheticEvent<HTMLElement, Event>, data: any) => setTags(data.value as string[])}
            options={tagOptions}
            search={true}
            selection={true}
            value={tags || []}
          />
        </Form.Field>

        <Form.Field>
          <Label htmlFor="tags" className="labelSmall">
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Interpolation Type, default is none. Meaning no interpolation is applied and values for each stress period have to be provided.'}
              hideOnScroll={true}
              size="tiny"
            />
            Interpolation Type
          </Label>

          {isTimeSeriesDependent && (
            <DropdownComponent.Dropdown
              fluid={true}
              options={[
                {key: 'forward_fill', text: 'Forward Fill', value: 'forward_fill'},
                {key: 'nearest', text: 'Nearest', value: 'nearest'},
                {key: 'linear', text: 'Linear', value: 'linear'},
              ]}
              selection={true}
              value={interpolation || ''}
              onChange={(_, {value}) => setInterpolation(value as IInterpolationType)}
            />)}
        </Form.Field>
        {!isReadOnly && (
          <Form.Field>
            <Button
              primary={true}
              onClick={handleSubmit}
              disabled={!isDirty()}
              loading={submitting}
              content={'Save'}
            />
          </Form.Field>
        )}
      </DataRow>
    </Form>
  );
};

export default BoundariesForm;
