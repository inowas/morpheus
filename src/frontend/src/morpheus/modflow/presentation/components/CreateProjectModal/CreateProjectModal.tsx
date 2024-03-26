import {Button, Dropdown, Form, TextArea} from 'semantic-ui-react';
import React, {useState} from 'react';

import RandomImage from 'common/components/RandomImage';
import styles from './CreateProjectModal.module.less';
import Images from './images';
import {Modal} from 'common/components';
import {IError} from '../../../../types';

const options = [
  {key: '1', text: 'React', value: 'React'},
  {key: '2', text: 'Python', value: 'Python'},
  {key: '3', text: 'Ezousa', value: 'Ezousa'},
  {key: '4', text: 'Simulation', value: 'Simulation'},
  {key: '5', text: 'Data', value: 'Data'},
];

interface IProps {
  open: boolean;
  onCancel: () => void;
  loading: boolean;
  error?: IError;
  onSubmit: (name: string, description: string, keywords: string[]) => void;
}

const CreateProjectModal = ({open, onCancel, onSubmit, loading, error}: IProps) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const formIsValid = () => {
    return 0 < projectName.trim().length;
  };

  const clearForm = () => {
    setProjectName('');
    setProjectDescription('');
    setSelectedKeywords([]);
  };

  const handleCancel = (event: React.FormEvent) => {
    event.preventDefault();
    clearForm();
    onCancel();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid()) {
      onSubmit(projectName, projectDescription, selectedKeywords);
      clearForm();
    }
  };

  return (
    <Modal.Modal open={open} dimmer={'blurring'}>
      <div className={`${styles.container}`} data-testid="create-project-modal">
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
            {error && <div className={styles.error}>{error.message}</div>}
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
                loading={loading}
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

export default CreateProjectModal;
