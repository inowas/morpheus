import {Form, Header, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button, Checkbox, DropdownComponent} from '../../../../../common/components';
import useProjectPermissions from '../../../application/useProjectPermissions';
import usePackages from '../../../application/usePackages';

const MfPackageProperties = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const settings = usePackages('mf');

  const [name, setName] = useState<string | undefined>(settings.name);
  const [verbose, setVerbose] = useState<boolean>(settings.values?.verbose || false);

  useEffect(() => {
    if (settings.name) {
      setName(settings.name);
    }
    if (settings.values) {
      setVerbose(settings.values.verbose || false);
    }
  }, [settings]);

  const nameOptions = [{
    key: settings.name,
    text: settings.name,
    value: settings.name,
  }, {
    key: 'mf2006',
    text: 'mf2006',
    value: 'mf2006',
  }];


  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <Header as={'h3'} dividing={true}>Flow Engine</Header>
      <div style={{
        boxShadow: '0 1px 2px 0 #eee, 0 0 0 1px #eee',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
      >
        <Form>
          <Form.Group widths="equal" style={{alignItems: 'stretch'}}>
            <Form.Field>
              <Label
                htmlFor="mfName"
                className="labelSmall"
              >
                <Popup
                  trigger={<Icon name="info circle"/>}
                  content={'The name of the executable to use (the default is ‘mf2005’).'}
                  hideOnScroll={true}
                  size="tiny"
                />
                Executable name
              </Label>
              <DropdownComponent.Dropdown
                disabled={isReadOnly}
                name="mfName"
                selection={true}
                value={name}
                options={nameOptions}
                onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setName(data.value)}
              />
            </Form.Field>
            <Form.Field>
              <Label
                htmlFor="mfVersion"
                className="labelSmall"
              >
                <Popup
                  trigger={<Icon name="info circle"/>}
                  content={'Version of MODFLOW to use (the default is ‘mf2005’).'}
                  hideOnScroll={true}
                  size="tiny"
                />
                Version
              </Label>
              <Input
                name="mfVersion"
                value={settings.engineType}
                readOnly={true}
              />
            </Form.Field>
            <Form.Field>
              <Label
                htmlFor="mfVerbose"
                className="labelSmall"
              >
                <Popup
                  trigger={<Icon name="info circle"/>}
                  content={'Print additional information to the screen (default is False).'}
                  hideOnScroll={true}
                  size="tiny"
                />
                Verbose
              </Label>
              <Checkbox
                style={{minHeight: 'unset', alignItems: 'center'}}
                disabled={isReadOnly}
                toggle={true}
                toggleStyle={'colored'}
                toggleSize={'large'}
                checked={verbose}
                onChange={() => setVerbose((prevVerbose) => !prevVerbose)}
              />
            </Form.Field>
          </Form.Group>
        </Form>
        <Button
          style={{marginTop: 'auto', marginLeft: 'auto'}}
          primary={true}
          disabled={isReadOnly}
          size={'medium'}
          icon={'save'}
          content={'Save'}
          onClick={() => {
            console.log('Save MF package properties', name, verbose);
          }}
        />
      </div>
    </div>
  );
};

export default MfPackageProperties;
