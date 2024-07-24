import React, {useEffect, useState} from 'react';

import {Form, Icon, Label, Popup, DropdownItemProps} from 'semantic-ui-react';
import {Button, DataRow, DropdownComponent} from 'common/components';

import isEqual from 'lodash.isequal';
import {boundarySettings, hasMultipleAffectedLayers} from '../helpers';

import {IBoundary, IBoundaryId, IInterpolationType} from '../../../../types/Boundaries.type';
import {ILayerId} from '../../../../types/Layers.type';


interface IProps {
  boundary: IBoundary;
  onChangeBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  onChangeBoundaryInterpolation: (boundaryId: IBoundaryId, interpolation: IInterpolationType) => Promise<void>;
  onChangeBoundaryTags: (boundaryId: IBoundaryId, boundaryTags: string[]) => Promise<void>;
  layers: ILayerMetadata[];
  isReadOnly: boolean;
}

interface ILayerMetadata {
  layer_id: string;
  name: string;
}

const BoundariesForm = ({boundary, onChangeBoundaryTags, onChangeBoundaryAffectedLayers, onChangeBoundaryInterpolation, isReadOnly, layers}: IProps) => {

  const [boundaryLocal, setBoundaryLocal] = useState<IBoundary>(boundary);
  const [tagOptions, setTagOptions] = useState<DropdownItemProps[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isDirty = () => {
    if (!isEqual(boundaryLocal.tags, boundary.tags)) {
      return true;
    }

    if (!isEqual(boundaryLocal.interpolation, boundary.interpolation)) {
      return true;
    }

    return !isEqual(boundaryLocal.affected_layers, boundary.affected_layers);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (boundary.tags !== boundaryLocal.tags) {
      await onChangeBoundaryTags(boundaryLocal.id, boundaryLocal.tags);
    }

    if (boundary.affected_layers !== boundaryLocal.affected_layers) {
      await onChangeBoundaryAffectedLayers(boundaryLocal.id, boundaryLocal.affected_layers);
    }

    if (boundary.interpolation !== boundaryLocal.interpolation) {
      await onChangeBoundaryInterpolation(boundaryLocal.id, boundaryLocal.interpolation);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    setBoundaryLocal(boundary);
    setTagOptions(boundary.tags.map((tag) => ({key: tag, text: tag, value: tag})) as DropdownItemProps[]);
  }, [boundary]);

  const isTimeSeriesDependent = boundarySettings.find((b) => b.type === boundary.type)?.isTimeSeriesDependent || false;

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
            name={'selectedLayer'}
            multiple={hasMultipleAffectedLayers(boundaryLocal.type)}
            selection={true}
            value={hasMultipleAffectedLayers(boundaryLocal.type) ? boundaryLocal.affected_layers : boundaryLocal.affected_layers[0]}
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

              setBoundaryLocal({...boundaryLocal, affected_layers: value as ILayerId[]});
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
            onChange={(_: React.SyntheticEvent<HTMLElement, Event>, data: any) => setBoundaryLocal({...boundaryLocal, tags: data.value as string[]})}
            options={tagOptions}
            search={true}
            selection={true}
            value={boundaryLocal.tags}
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
              value={boundaryLocal.interpolation}
              onChange={(_, {value}) => setBoundaryLocal({...boundaryLocal, interpolation: value as IInterpolationType})}
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
