import {Form, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React from 'react';
import {Settings} from '../../../application/usePackages';
import {DatePicker} from '../../../../../common/components';

interface IDisGeneralProperties {
  isReadOnly: boolean;
  handleValueChange: (key: string, value: any) => void;
  disPackage: Settings;
}

const DisGeneralProperties = ({isReadOnly, handleValueChange, disPackage}: IDisGeneralProperties) => {


  return (
    <Form>
      <Form.Group
        widths={4}
        style={{
          alignItems: 'stretch',
          flexWrap: 'wrap',
          rowGap: 20,
        }}
      >
        <Form.Field>
          <Label
            htmlFor="itmuni"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Time units, default is days (4)'}
              hideOnScroll={true}
              size="tiny"
            />
            Time units (itmuni)
          </Label>
          <Input
            min={1}
            disabled={isReadOnly}
            name="itmuni"
            type="number"
            value={disPackage.values.itmuni}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="lenuni"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Length units, default is meters (2)'}
              hideOnScroll={true}
              size="tiny"
            />
            Length units (lenuni)
          </Label>
          <Input
            min={2}
            disabled={isReadOnly}
            name="lenuni"
            type="number"
            value={disPackage.values.lenuni}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="dis"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Filename extension (default is ‘dis’)'}
              hideOnScroll={true}
              size="tiny"
            />
            Filename extension
          </Label>
          <Input
            name="dis"
            value={disPackage.values.extension || ''}
            readOnly={true}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="unitnumber"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'File unit number (default is None)'}
              hideOnScroll={true}
              size="tiny"
            />
            File unit number
          </Label>
          <Input
            disabled={isReadOnly}
            name="unitnumber"
            type="number"
            value={disPackage.values.unitnumber || ''}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group
        widths={3}
        style={{
          alignItems: 'stretch',
          flexWrap: 'wrap',
          rowGap: 20,
        }}
      >
        <Form.Field>
          <Label
            htmlFor="xul"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'x coordinate of upper left corner of the grid, default is None'}
              hideOnScroll={true}
              size="tiny"
            />
            Upper left corner x coordinate (xul)
          </Label>
          <Input
            min={0}
            step={0.000001}
            disabled={isReadOnly}
            name="xul"
            type="number"
            value={disPackage.values.xul || ''}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="yul"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'y coordinate of upper left corner of the grid, default is None'}
              hideOnScroll={true}
              size="tiny"
            />
            Upper left corner y coordinate (yul)
          </Label>
          <Input
            min={0}
            step={0.000001}
            disabled={isReadOnly}
            name="yul"
            type="number"
            value={disPackage.values.yul || ''}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="rotation"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Clockwise rotation (in degrees) of the grid about the upper left corner. default is 0.0'}
              hideOnScroll={true}
              size="tiny"
            />
            Rotation
          </Label>
          <Input
            step={0.1}
            disabled={isReadOnly}
            name="rotation"
            type="number"
            value={disPackage.values.rotation || '0.0'}
            onChange={(e, {name, value}) => handleValueChange(name, Number(value))}
          />
        </Form.Field>
      </Form.Group>
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
            htmlFor="proj4_str"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'PROJ4 string that defines the xul-yul coordinate system (.e.g. ‘+proj=longlat +ellps=WGS84\n' +
                '      +datum=WGS84 +no_defs ‘). Can be an EPSG code (e.g. ‘EPSG:4326’). Default is ‘EPSG:4326’'}
              hideOnScroll={true}
              size="tiny"
            />
            Coordinate system (proj4_str)
          </Label>
          <Input
            disabled={isReadOnly}
            name="proj4_str"
            type="text"
            value={disPackage.values.proj4_str || ''}
            onChange={(e, {name, value}) => handleValueChange(name, value)}
          />
        </Form.Field>
        <Form.Field>
          <Label
            htmlFor="start_datetime"
            className="labelSmall"
          >
            <Popup
              trigger={<Icon name="info circle"/>}
              content={'Starting datetime of the simulation. default is ‘1/1/1970’'}
              hideOnScroll={true}
              size="tiny"
            />
            Starting date time (start_dateteim)
          </Label>
          <DatePicker
            wrapperClassName="fullWidth"
            name="start_datetime"
            disabled={isReadOnly}
            selected={disPackage.values.start_datetime}
            dateFormat="dd.MM.yyyy"
            onChange={(date) => handleValueChange('start_datetime', date?.toISOString() || '1970-01-01 00:00:00')}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default DisGeneralProperties;
