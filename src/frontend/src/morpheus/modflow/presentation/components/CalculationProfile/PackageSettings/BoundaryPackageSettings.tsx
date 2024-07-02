import React from 'react';
import {ICalculationProfile} from '../../../../types/CalculationProfile.type';
import {SectionTitle} from '../../../../../../common/components';
import PackageWrapper from './PackageWrapper';
import {Form, Header} from 'semantic-ui-react';
import {CheckBox, DropdownInput, NumberInput} from '../FormFields';
import descriptions from './PackagePropsDescriptions';


interface IProps {
  settings: ICalculationProfile['engine_settings']
  onChange: (settings: ICalculationProfile['engine_settings']) => void
  isReadOnly: boolean
}


const BoundaryPackageSettings = ({settings, onChange, isReadOnly}: IProps) => {
  
  return (
    <>
      <SectionTitle
        as={'h5'}
        title={'Boundary Packages'}
        style={{marginBottom: 15}}
      />
      <PackageWrapper>
        {settings.chd.laycbd && <>
          <Header as={'h3'} dividing={true}>CHD: Constant Head Package</Header>
          <Form>
            <Form.Group
              widths={2}
              style={{
                alignItems: 'stretch',
                flexWrap: 'wrap',
                rowGap: 20,
              }}
            >
              <CheckBox
                label={'LAYCBD'}
                value={settings.chd.laycbd}
                onChange={(value: boolean) => onChange({...settings, chd: {...settings.chd, laycbd: value}})}
                isReadOnly={isReadOnly}
                // TODO add description in 'PackagePropsDescriptions' file
                description={descriptions.chd.laycbd}
              />
            </Form.Group>
          </Form>
        </>}

        <Header as={'h3'} dividing={true}>DRN: Drain Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'DRN: Save cell-by-cell budget data (IPAKCB)'}
              value={settings.drn.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, drn: {...settings.drn, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.drn.ipakcb}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>EVT: Evapotranspiration Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <DropdownInput
              label={'ET option (NEVTOP)'}
              value={settings.evt.nevtop}
              isReadOnly={isReadOnly}
              description={descriptions.evt.nevtop}
              options={[
                {key: '1', value: 1, text: '1: ET is calculated only for cells in the top grid layer'},
                {key: '2', value: 2, text: '2: ET to layer defined in ievt'},
                {key: '3', value: 3, text: '3: ET to highest active cell'},
              ]}
              onChange={(value: number) => onChange({...settings, evt: {...settings.evt, nevtop: value}})}
            />
            <CheckBox
              label={'EVT: Save cell-by-cell budget data (IPAKCB)'}
              value={settings.evt.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, evt: {...settings.evt, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.evt.ipakcb}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>FHB: Flow and Head Boundary Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'FHB: Save cell-by-cell data (IPAKCB)'}
              value={settings.fhb.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, fhb: {...settings.fhb, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.fhb.ipakcb}
            />
            <CheckBox
              label={'FHB: Steady-state option (IFHBSS)'}
              value={settings.fhb.ifhbss ? true : false}
              onChange={(value: boolean) => onChange({...settings, fhb: {...settings.fhb, ifhbss: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.fhb.ifhbss}
            />
            <CheckBox
              label={'FHB: Print data list (IFHBPT)'}
              value={settings.fhb.ifhbpt ? true : false}
              onChange={(value: boolean) => onChange({...settings, fhb: {...settings.fhb, ifhbpt: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.fhb.ifhbpt}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>GHB: General-Head Boundary Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'GHB: Save cell-by-cell budget data (IPAKCB)'}
              value={settings.ghb.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, ghb: {...settings.ghb, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.ghb.ipakcb}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>LAK: Lake Boundary Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'LAK: Save cell-by-cell data (IPAKCB)'}
              value={settings.lak.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, lak: {...settings.lak, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.lak.ipakcb}
            />
            <NumberInput
              label={'LAK: Theta parameter (THETA)'}
              value={settings.lak.theta}
              onChange={(value: number) => onChange({...settings, lak: {...settings.lak, theta: value}})}
              isReadOnly={isReadOnly}
              description={descriptions.lak.theta}
              precision={2}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>RCH: Recharge Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'RCH: Save cell-by-cell data (IPAKCB)'}
              value={settings.rch.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, rch: {...settings.rch, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.rch.ipakcb}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>RIV: River Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'RIV: Save cell-by-cell data (IPAKCB)'}
              value={settings.riv.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, riv: {...settings.riv, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.riv.ipakcb}
            />
          </Form.Group>
        </Form>

        <Header as={'h3'} dividing={true}>WEL: Well Package</Header>
        <Form>
          <Form.Group
            widths={2}
            style={{
              alignItems: 'stretch',
              flexWrap: 'wrap',
              rowGap: 20,
            }}
          >
            <CheckBox
              label={'RIV: Save cell-by-cell data (IPAKCB)'}
              value={settings.wel.ipakcb ? true : false}
              onChange={(value: boolean) => onChange({...settings, wel: {...settings.wel, ipakcb: value ? 1 : 0}})}
              isReadOnly={isReadOnly}
              description={descriptions.wel.ipakcb}
            />
          </Form.Group>
        </Form>

      </PackageWrapper>
    </>

  );
};

export default BoundaryPackageSettings;
