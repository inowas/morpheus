import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React from 'react';
import {Checkbox} from '../../../../../common/components';
import {Settings} from '../../../application/usePackages';

interface ISpatialDiscretization {
  isReadOnly: boolean;
  handleValueChange: (key: string, value: any) => void;
  disPackage: Settings;
}

const DisSpatialDiscretization = ({isReadOnly, handleValueChange, disPackage}: ISpatialDiscretization) => {

  return (
    <Form>
      <Form.Group
        widths={2}
        style={{
          alignItems: 'stretch',
          flexWrap: 'wrap',
          rowGap: 20,
        }}
      >
        <Form.Field>
          <Label
            htmlFor="nlay"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Number of model layers (the default is 1)'}
              hideOnScroll={true}
              size="tiny"
            />
            Layers (nlay)
          </Label>
          <Input
            min={1}
            disabled={isReadOnly}
            name="nlay"
            type="number"
            value={disPackage.values.nlay}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="delr"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'An array of spacings along a row (the default is 1.0)'}
              hideOnScroll={true}
              size="tiny"
            />
            Row spacing (delr)
          </Label>
          <Input
            disabled={isReadOnly}
            name="delr"
            type="text"
            value={disPackage.values.delr}
            onChange={(e, {name, value}) => {
              const newValue = (value).split(',').map((val) => Number(val));
              handleValueChange(name, newValue);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="nrow"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Number of model rows (the default is 2)'}
              hideOnScroll={true}
              size="tiny"
            />
            Rows (nrow)
          </Label>
          <Input
            min={2}
            disabled={isReadOnly}
            name="nrow"
            type="number"
            value={disPackage.values.nrow}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="delc"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'An array of spacings along a column (the default is 0.0)'}
              hideOnScroll={true}
              size="tiny"
            />
            Column spacing (delc)
          </Label>
          <Input
            disabled={isReadOnly}
            name="delc"
            type="text"
            value={disPackage.values.delc}
            onChange={(e, {name, value}) => {
              const newValue = (value).split(',').map((val) => Number(val));
              handleValueChange(name, newValue);
            }}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="ncol"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Number of model columns (the default is 2)'}
              hideOnScroll={true}
              size="tiny"
            />
            Columns (ncol)
          </Label>
          <Input
            min={1}
            disabled={isReadOnly}
            name="ncol"
            type="number"
            value={disPackage.values.ncol}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="laycbd"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'An array of flags indicating whether or not a layer has a Quasi-3D confining bed below it.\n' +
                '      0 indicates no confining bed, and not zero indicates a confining bed. LAYCBD for the bottom layer must be 0.\n' +
                '      (the default is 0)'}
              hideOnScroll={true}
              size="tiny"
            />
            Confining bed (laycbd)
          </Label>
          <Checkbox
            name="laycbd"
            style={{minHeight: 'unset', alignItems: 'center'}}
            disabled={isReadOnly}
            toggle={true}
            toggleStyle={'colored'}
            toggleSize={'large'}
            checked={disPackage.values?.laycbd || false}
            onChange={(_, {checked}) => handleValueChange('laycbd', checked)}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="nper"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Number of model stress periods (the default is 1)'}
              hideOnScroll={true}
              size="tiny"
            />
            Stress periods (nper)
          </Label>
          <Input
            min={1}
            disabled={isReadOnly}
            name="nper"
            type="number"
            value={disPackage.values.nper}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default DisSpatialDiscretization;
