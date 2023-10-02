import React, {BaseSyntheticEvent, useEffect, useRef, useState} from 'react';
import {Container, Menu, Segment, Sidebar} from 'semantic-ui-react';
import {IDetailsAttribute} from './types/DataAttribute.type';
import HeaderImage from './components/HeaderImage';
import {Button, Grid, Icon, Label} from 'components/index';
import StringInput from './components/StringInput';

interface IProps<D> {
  open: boolean;
  data: D | null;
  attributes: IDetailsAttribute[];
  loading: boolean;
  error?: string;
  onSubmit: (data: D) => void;
  onClose: () => void;
  onHidden?: () => void;
  isCreate: boolean;
  translate: (key: string) => string;
  color?: string;
  onShowModal?: () => void;
  defaultImage?: string;
}

interface IError {
  fieldKey: string;
  error: string;
}

const Details = <D extends { [key: string]: any }>({
  open,
  data: dataProps,
  attributes,
  loading,
  onSubmit,
  onClose,
  onShowModal,
  onHidden,
  isCreate,
  translate,
  color,
  defaultImage,
}: IProps<D>) => {

  const [data, setData] = useState<D | null>(dataProps);
  const [errors, setErrors] = useState<IError[]>([]);
  const headerContainerRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [headerSize, setHeaderSize] = useState<number | undefined>(headerContainerRef?.current?.clientHeight);
  const [scroll, setScroll] = useState<boolean>(false);
  const [elementCanScroll, setElementCanScroll] = useState<boolean>(false);

  useEffect(() => {
    setData(dataProps);
    setScroll(false);
  }, [dataProps]);

  useEffect(() => {
    setHeaderSize(headerContainerRef?.current?.clientHeight);
  }, [headerContainerRef]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (null === data) {
      return;
    }

    const validationErrors: IError[] = [];
    attributes.forEach((attribute) => {
      const errorMessage = attribute.validate && attribute.validate(data[attribute.fieldKey]);
      if (errorMessage) {
        validationErrors.push({fieldKey: attribute.fieldKey, error: errorMessage});
      }
    });

    setErrors(validationErrors);
    if (0 === validationErrors.length) {
      return onSubmit(data);
    }
  };

  const handleChangeProperty = (attribute: IDetailsAttribute) => (value: any) => {
    setErrors(errors.filter((error) => error.fieldKey !== attribute.fieldKey));
    if (null === data) {
      return setData({[attribute.fieldKey]: value} as D);
    }
    setData({...data, [attribute.fieldKey]: value});
  };

  const handleScroll = (event: BaseSyntheticEvent) => {
    const elementCanBeScrolled = event.target.scrollHeight !== event.target.clientHeight;
    if (0 < event.target.scrollTop && elementCanBeScrolled) {
      setScroll(true);
      setHeaderSize(headerContainerRef?.current?.clientHeight);
    }

    if (0 === event.target.scrollTop && elementCanBeScrolled) {
      setScroll(false);
      setTimeout(() => {
        setHeaderSize(headerContainerRef?.current?.clientHeight);
      }, 300);
    }

    if (0 === event.target.scrollTop && !elementCanBeScrolled) {
      setElementCanScroll(true);
    }
  };

  const handleClose = () => {
    setErrors([]);
    onClose();
  };

  const filteredGroupsOfFieldDefinitions = attributes.reduce((acc: { [formGroup: string]: IDetailsAttribute[] }, el) => {
    if (!acc[el.form_group]) {
      acc[el.form_group] = [el];
      return acc;
    }
    acc[el.form_group].push(el);
    return acc;
  }, {});
  const groupedFieldDefinitions = Object.entries(filteredGroupsOfFieldDefinitions);

  return (
    <Sidebar
      style={{
        bottom: 0,
        backgroundColor: '#eee',
        minWidth: 600,
        boxShadow: '0 3px 9px rgb(0 0 0 / 50%)',
        zIndex: 100000,
      }}
      as={Menu}
      animation="overlay"
      vertical={true}
      visible={open}
      direction="right"
      width="very wide"
      data-testid="sideBar"
      onHidden={onHidden}
      className='scrollNone'
    >
      <Container
        style={{
          position: 'relative',
          padding: '0px',
        }}
        data-testid="details-container"
      >
        <div
          ref={headerContainerRef}
          style={{display: 'flex', flexDirection: 'column', transition: 'all 300ms linear', position: 'relative'}}
          className={scroll ? 'headerImageOnScroll' : undefined}
        >
          <div style={{display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 10, right: 0}}>
            {onShowModal && <Icon
              name="list"
              data-testid="sideBarCloseButton"
              className={'closeButton headerImageOnScroll__icon'}
              onClick={onShowModal}
              style={{cursor: 'pointer', zIndex: 99, textIndent: 'unset', textShadow: 'none'}}
            />}
            <Icon
              name="close"
              data-testid="sideBarCloseButton"
              className='closeButton headerImageOnScroll__icon'
              onClick={handleClose}
              style={{cursor: 'pointer', zIndex: 99, textIndent: 'unset', textShadow: 'none'}}
            />
          </div>
          <HeaderImage
            text={isCreate ? translate('create_item') : translate('edit_item')}
            color={color}
            placeHolderImage={defaultImage}
          />
        </div>
        <Segment style={{height: '100%', borderRadius: 0, border: 'none', backgroundColor: '#ebebeb', boxShadow: 'none', padding: '0px'}}>
          <form
            style={{
              display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between',
            }}
          >
            <div
              className={['scrollBarDetails', elementCanScroll ? 'canScroll' : ''].join(' ')} onScroll={handleScroll}
              style={{
                height: `calc(97vh - ${headerSize!}px)`,
                overflowY: 'auto',
                paddingBottom: 80,
              }}
            >
              {groupedFieldDefinitions.map((group) => {
                const groupName = group[0];
                const groupedFields = group[1];
                return (
                  <Segment key={groupName} style={{width: '90%', marginRight: 'auto', marginLeft: 'auto'}}>
                    <Label
                      as='a'
                      ribbon={true}
                      style={{marginBottom: 15, fontWeight: 'bold', backgroundColor: '#f9b232', textTransform: 'capitalize'}}
                    >{groupName}</Label>
                    <Grid.Grid
                      columns={2} stackable={true}
                      style={{marginLeft: 0, marginRight: 0}}
                    >
                      <Grid.Row style={{margin: 0}}>
                        {groupedFields.map((attribute) => {
                          if ('string' === attribute.type) {
                            const stringValue = null === data ? '' : data[attribute.fieldKey];
                            return (
                              <Grid.Column
                                style={{paddingLeft: 0}}
                                key={attribute.fieldKey}
                              >
                                <StringInput
                                  key={attribute.fieldKey}
                                  value={stringValue}
                                  readOnly={false}
                                  width="eight"
                                  onChange={(value: string) => handleChangeProperty(attribute)(value)}
                                  label={attribute.label}
                                  error={errors.find((error) => error.fieldKey === attribute.fieldKey)?.error}
                                  data-testid={`string-input-${attribute.fieldKey}`}
                                />
                              </Grid.Column>
                            );
                          }
                        })}
                      </Grid.Row>
                    </Grid.Grid>
                  </Segment>
                );
              })}
            </div>
            <div style={{
              backgroundColor: '#eee',
              position: 'fixed',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid rgba(34, 36, 38, 0.15)',
              textAlign: 'center',
              padding: '15px 0',
              zIndex: 99,
            }}
            >
              <Button
                type="submit"
                primary={true}
                loading={loading}
                onClick={handleSubmit}
                data-testid="sideBarSubmitButton"
              >
                {isCreate ? translate('create_item_submit') : translate('edit_item_submit')}
              </Button>
            </div>
          </form>
        </Segment>
      </Container>
    </Sidebar>
  );

};
export default Details;
