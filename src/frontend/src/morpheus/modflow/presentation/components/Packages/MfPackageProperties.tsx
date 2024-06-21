import {Form, Header, Icon, Input, Label, Popup} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button, Checkbox, DropdownComponent} from '../../../../../common/components';
import useProjectPermissions from '../../../application/useProjectPermissions';
import usePackages, {Settings} from '../../../application/usePackages';
import setPackage from './helpers/setPackage';
import PackageWrapper from './PackageWrapper';


const MfPackageProperties = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {settings} = usePackages('mf');
  const [mfPackage, setMfPackage] = useState<Settings>(settings);

  useEffect(() => {
    if (settings) {
      setMfPackage(settings);
    }
  }, [settings]);

  const handleValueChange = (key: string, value: any) => {
    setPackage(setMfPackage, mfPackage, key, value);
  };

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
    <>
      <Header as={'h3'} dividing={true}>Flow Engine</Header>
      <PackageWrapper>
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
                value={mfPackage.name}
                options={nameOptions}
                onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
                  setMfPackage((prevState) => {
                    return {
                      ...prevState,
                      name: data.value,
                    };
                  });
                }}
              />
            </Form.Field>
            <Form.Field>
              <Label
                htmlFor="mfVersion"
                className="labelSmall"
              >
                <Popup
                  trigger={<Icon name="info circle"/>}
                  content={'Version of MODFLOW to use (the default is ‘mf2005’)'}
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
                  content={'Print additional information to the screen (default is False)'}
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
                checked={mfPackage.values?.verbose || false}
                onChange={(_, {checked}) => handleValueChange('verbose', checked)}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </PackageWrapper>
      {!isReadOnly && <Button
        style={{marginLeft: 'auto', display: 'block'}}
        primary={true}
        disabled={isReadOnly}
        size={'medium'}
        icon={'save'}
        content={'Save'}
        onClick={() => {
          console.log('Save MF package properties', mfPackage);
        }}
      />}
    </>
  );
};

export default MfPackageProperties;
