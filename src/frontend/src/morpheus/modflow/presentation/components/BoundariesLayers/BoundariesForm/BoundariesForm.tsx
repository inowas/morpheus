import {Button, DataRow, DropdownComponent} from 'common/components';

import React, {useEffect, useState} from 'react';
import {Form, Icon, Label, Popup} from 'semantic-ui-react';
import {IBoundary, IBoundaryId} from '../../../../types/Boundaries.type';
import {ILayerId} from '../../../../types/Layers.type';
import {DropdownItemProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import isEqual from 'lodash.isequal';
import {canHaveMultipleAffectedLayers} from '../../ModelBoundaries/helpers';


interface IProps {
  boundary: IBoundary;
  onChangeBoundaryTags: (boundaryId: IBoundaryId, boundaryTags: string[]) => Promise<void>;
  onChangeBoundaryAffectedLayers: (boundaryId: IBoundaryId, affectedLayers: ILayerId[]) => Promise<void>;
  layers: ILayerMetadata[];
  isReadOnly: boolean;
}

interface ILayerMetadata {
  layer_id: string;
  name: string;
}

const BoundariesForm = ({boundary, onChangeBoundaryTags, onChangeBoundaryAffectedLayers, isReadOnly, layers}: IProps) => {

  const [boundaryLocal, setBoundaryLocal] = useState<IBoundary>(boundary);
  const [tagOptions, setTagOptions] = useState<DropdownItemProps[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isDirty = () => {
    if (!isEqual(boundaryLocal.tags, boundary.tags)) {
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
    setSubmitting(false);
  };

  useEffect(() => {
    setBoundaryLocal(boundary);
    setTagOptions(boundary.tags.map((tag) => ({key: tag, text: tag, value: tag})) as DropdownItemProps[]);
  }, [boundary]);

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
            name="selectedLayer"
            multiple={canHaveMultipleAffectedLayers(boundaryLocal)}
            selection={true}
            value={canHaveMultipleAffectedLayers(boundaryLocal) ? boundaryLocal.affected_layers : boundaryLocal.affected_layers[0]}
            options={layers.map((layer) => ({
              key: layer.layer_id,
              text: layer.name,
              value: layer.layer_id,
            }))}
            onChange={(event, {value}) => {
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
            onAddItem={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setTagOptions([...tagOptions, {key: data.value, text: data.value, value: data.value}])}
            onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
              console.log(data.value);
              setBoundaryLocal({...boundaryLocal, tags: data.value as string[]});
            }}
            options={tagOptions}
            search={true}
            selection={true}
            value={boundaryLocal.tags}
          />
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
