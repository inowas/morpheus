import {Header} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button} from '../../../../../common/components';
import useProjectPermissions from '../../../application/useProjectPermissions';
import usePackages, {Settings} from '../../../application/usePackages';
import {Accordion, AccordionContent} from '../Content';
import setPackage from './helpers/setPackage';
import DisSpatialDiscretization from './DisSpatialDiscretization';
import DisGeneralProperties from './DisGeneralProperties';
import PackageWrapper from './PackageWrapper';

const DisPackageProperties = () => {
  const {projectId} = useParams();
  const {isReadOnly} = useProjectPermissions(projectId as string);
  const {settings} = usePackages('dis');
  const [disPackage, setDisPackage] = useState<Settings>(settings);

  useEffect(() => {
    if (settings) {
      setDisPackage(settings);
    }
  }, [settings]);


  const handleValueChange = (key: string, value: any) => {
    setPackage(setDisPackage, disPackage, key, value);
  };

  return (
    <>
      <Header as={'h3'} dividing={true}>DIS: Discretization Package</Header>
      <PackageWrapper>
        <Accordion
          defaultActiveIndex={[0]}
          exclusive={true}
        >
          <AccordionContent title={'Spatial Discretization'}>
            {disPackage.values && <DisSpatialDiscretization
              disPackage={disPackage} handleValueChange={handleValueChange}
              isReadOnly={isReadOnly}
            />}
          </AccordionContent>
          <AccordionContent title={'Layer Parameters'}>
            <h3 style={{padding: 30}}>Layer Parameters Content</h3>
          </AccordionContent>
        </Accordion>
      </PackageWrapper>
      <PackageWrapper>
        {disPackage.values && <DisGeneralProperties
          disPackage={disPackage}
          handleValueChange={handleValueChange}
          isReadOnly={isReadOnly}
        />}
      </PackageWrapper>
      {!isReadOnly && <Button
        style={{marginLeft: 'auto', display: 'block'}}
        primary={true}
        disabled={isReadOnly}
        size={'medium'}
        icon={'save'}
        content={'Save'}
        onClick={() => {
          console.log('Save DIS package properties', disPackage);
        }}
      />}
    </>
  );
};

export default DisPackageProperties;
