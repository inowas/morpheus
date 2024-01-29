import React, {useState} from 'react';
import {Button, Dropdown, Form, TextArea} from 'semantic-ui-react';
import styles from './ModelsCreate.module.less';
import Images from './Images';
import RandomImage from 'components/RandomImage';

const options = [
  {key: '1', text: 'React', value: 'React'},
  {key: '2', text: 'Python', value: 'Python'},
  {key: '3', text: 'Ezousa', value: 'Ezousa'},
  {key: '4', text: 'Simulation', value: 'Simulation'},
  {key: '5', text: 'Data', value: 'Data'},
];

interface IProps {
  onCreateButtonClick?: () => void;
}

const ModelsCreate = ({onCreateButtonClick}: IProps) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleProjectDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProjectDescription(event.target.value);
  };

  const handleKeywordsChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
    setSelectedKeywords(data.value as string[]);
  };

  const isFormValid = '' !== projectName.trim();

  const clearForm = () => {
    setProjectName('');
    setProjectDescription('');
    setSelectedKeywords([]);
  };

  const handleCancel = (event: React.FormEvent) => {
    event.preventDefault();
    clearForm();
    if (onCreateButtonClick) onCreateButtonClick();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      console.log('Form data submitted:', {
        projectName,
        projectDescription,
        selectedKeywords,
      });
      clearForm();
      if (onCreateButtonClick) onCreateButtonClick();
    }
  };


  return (
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
              onChange={handleProjectNameChange}
            />
          </Form.Field>
          <Form.Field className={styles.field}>
            <label className={`${styles.label} h4`}>Project description</label>
            <TextArea value={projectDescription} onChange={handleProjectDescriptionChange}/>
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
              onChange={handleKeywordsChange}
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
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Create new project
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModelsCreate;
