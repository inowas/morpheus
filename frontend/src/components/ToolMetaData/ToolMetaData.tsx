import {Breadcrumb, Button, Checkbox, CheckboxProps, Form, Grid, InputOnChangeData, Modal, TextAreaProps} from 'semantic-ui-react';
import {IToolMetaDataEdit, IToolName} from './ToolMetaData.type';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';

interface IProps {
  isDirty: boolean;
  onSave: (tool: IToolMetaDataEdit) => any;
  saveButton?: boolean;
  onReset?: () => any;
  readOnly: boolean;
  tool: IToolMetaDataEdit;
  toolNames: IToolName[];
  navigateTo: (path: string) => any;
}

const ToolMetaData = ({isDirty, onSave, saveButton, onReset, tool, toolNames, navigateTo, readOnly}: IProps) => {
  const [selectedTool, setSelectedTool] = useState<IToolMetaDataEdit>(tool);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setSelectedTool(tool);
  }, [tool]);

  const handleButtonClick = () => setIsEditing(!isEditing);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
    {value, name, checked}: CheckboxProps | InputOnChangeData | TextAreaProps,
  ) => {
    const cTool = {
      ...selectedTool,
      [name]: checked !== undefined ? checked : value,
    };
    setSelectedTool(cTool);
  };

  const handleSave = () => {
    onSave(selectedTool);
    setIsEditing(false);
  };

  const renderBreadcrumbs = () => {
    let fTool = {name: ''};
    const filteredTools = toolNames.filter((t) => selectedTool.tool === t.slug);
    if (0 < filteredTools.length) {
      fTool = filteredTools[0];
    }

    return (
      <Breadcrumb>
        <Breadcrumb.Section link={true} onClick={() => navigateTo('/tools')}>
          Tools
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron"/>
        <Breadcrumb.Section>
          {selectedTool.tool}. {fTool.name}
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right arrow"/>
        <Breadcrumb.Section active={true}>
          {selectedTool.name}
          {!readOnly && <Button
            basic={true} size={'small'}
            icon="pencil" onClick={handleButtonClick}
          />}
        </Breadcrumb.Section>
      </Breadcrumb>
    );
  };


  return (
    <div>
      <Grid padded={true}>
        <Grid.Column style={{paddingTop: 0, paddingBottom: 0}}>
          {renderBreadcrumbs()}
          {saveButton && (
            <Button
              positive={isDirty}
              disabled={!isDirty}
              floated={'right'}
              icon={'save'}
              onClick={() => onSave(selectedTool)}
            />
          )}

          {onReset && <Button
            negative={true} floated={'right'}
            icon={'redo'} onClick={onReset}
          />}
        </Grid.Column>
      </Grid>

      <Modal
        size={'mini'} open={isEditing}
        dimmer={'blurring'}
      >
        <Grid padded={true}>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form>
                <Form.Group>
                  <Form.Input
                    label="Name" name={'name'}
                    value={selectedTool.name} width={12}
                    onChange={handleInputChange}
                  />
                  <Form.Field width={1}>
                    <label>Public</label>
                    <Checkbox
                      toggle={true} checked={selectedTool.public}
                      onChange={handleInputChange} name={'public'}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.TextArea
                    label="Description"
                    disabled={readOnly}
                    name="description"
                    onChange={handleInputChange}
                    placeholder="Description"
                    value={selectedTool.description}
                    width={16}
                  />
                </Form.Group>
                <Button onClick={handleButtonClick}>Cancel</Button>
                <Button
                  disabled={3 > selectedTool.name.length} positive={true}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal>
    </div>
  );
};

export default ToolMetaData;
