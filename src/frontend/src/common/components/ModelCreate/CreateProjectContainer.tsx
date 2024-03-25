import {Button, Dropdown, Form, TextArea} from 'semantic-ui-react';
import {Modal} from 'common/components';
import React, {useState} from 'react';

import Images from './Images';
import RandomImage from 'common/components/RandomImage';
import styles from './ModelCreate.module.less';

const options = [
  {key: '1', text: 'React', value: 'React'},
  {key: '2', text: 'Python', value: 'Python'},
  {key: '3', text: 'Ezousa', value: 'Ezousa'},
  {key: '4', text: 'Simulation', value: 'Simulation'},
  {key: '5', text: 'Data', value: 'Data'},
];

interface IProps {
  onClose: () => void;
}

const CreateProjectContainer = ({onClose}: IProps) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const formIsValid = () => {
    return '' !== projectName.trim();
  };

  const clearForm = () => {
    setProjectName('');
    setProjectDescription('');
    setSelectedKeywords([]);
  };

  const handleCancel = (event: React.FormEvent) => {
    event.preventDefault();
    clearForm();
    if (onClose) onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // validate input
    if (!formIsValid()) {
      return;
    }

    console.log('Form data submitted:', {
      projectName,
      projectDescription,
      selectedKeywords,
    });
    clearForm();
    if (onClose) onClose();
  };

  return (
    <Modal.Modal open={true} dimmer={'blurring'}>
      <div className={`${styles.container}`} data-testid="ModelCreate-container">
        <div className={styles.image}>
          <RandomImage images={Images}/>
        </div>
        <div className={styles.form}>
          <h1 className={styles.title}>
            Create new project
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Field className={styles.field}>
              <label className={`${styles.label} h4`}>Project name<span className="required">*</span></label>
              <input
                type="text" value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </Form.Field>
            <Form.Field className={styles.field}>
              <label className={`${styles.label} h4`}>Project description</label>
              <TextArea
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
              />
            </Form.Field>
            <Form.Field className={styles.field}>
              <label className={`${styles.label} h4`}>Project keywords</label>
              <Dropdown
                name="selectedKeywords"
                fluid={true}
                multiple={true}
                selection={true}
                options={options}
                value={selectedKeywords}
                onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setSelectedKeywords(data.value as string[])}
              />
            </Form.Field>
            <div className={styles.mandatory}>
              <span className="required">*</span>Mandatory field
            </div>
            <div className={styles.buttons}>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                primary={true}
                disabled={!formIsValid()}
                onClick={handleSubmit}
              >
                Create new project
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal.Modal>
  );
};

export default CreateProjectContainer;
