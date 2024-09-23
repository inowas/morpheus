import {Button, Form, TextArea} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';

import RandomImage from 'common/components/RandomImage';
import styles from './ProjectMetadataModal.module.less';
import Images from './images';
import {DropdownComponent, Modal} from 'common/components';
import {IError} from '../../../../types';
import {IMetadata} from '../../../types';

interface IProps {
  metadata?: IMetadata;
  open: boolean;
  onCancel: () => void;
  loading: boolean;
  error?: IError;
  onSubmit: (metadata: IMetadata) => void;
}

const ProjectMetadataModal = ({metadata, open, onCancel, onSubmit, loading, error}: IProps) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [options, setOptions] = useState([{key: '0', text: 'Modflow', value: 'modflow'}]);

  useEffect(() => {
    if (metadata) {
      setProjectName(metadata.name);
      setProjectDescription(metadata.description);
      setTags(metadata.tags);
    }
  }, [metadata]);

  const formIsValid = () => {
    return 0 < projectName.trim().length;
  };

  const clearForm = () => {
    setProjectName('');
    setProjectDescription('');
    setTags([]);
  };

  const handleCancel = (event: React.FormEvent) => {
    event.preventDefault();
    clearForm();
    onCancel();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid()) {
      onSubmit({name: projectName, description: projectDescription, tags});
      clearForm();
    }
  };

  return (
    <Modal.Modal open={open} dimmer={'blurring'}>
      <div className={`${styles.container}`} data-testid="project-meta-data-modal">
        <div className={styles.image}>
          <RandomImage images={Images}/>
        </div>
        <div className={styles.form}>
          <h1 className={styles.title}>
            {metadata ? 'Edit project metadata' : 'Create new project'}
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
              <DropdownComponent.Dropdown
                allowAdditions={true}
                name="selectedKeywords"
                fluid={true}
                multiple={true}
                onAddItem={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setOptions([...options, {key: data.value, text: data.value, value: data.value}])}
                onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data: any) => setTags(data.value as string[])}
                options={options}
                search={true}
                selection={true}
                value={tags}
              />
            </Form.Field>
            {error && <div className={styles.error}>{error.message}</div>}
            <div className={styles.mandatory}>
              <span className="required">*</span>Mandatory field
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 40}}>
              <Button
                secondary={true}
                onClick={handleCancel}
                labelPosition={'left'}
                style={{marginLeft: 'auto'}}
                size={'tiny'}
                icon={'remove'}
                content={'Cancel'}
              />
              <Button
                primary={true}
                disabled={!formIsValid()}
                onClick={handleSubmit}
                loading={loading}
                labelPosition={'left'}
                size={'tiny'}
                icon={'plus'}
                content={metadata ? 'Save changes' : 'Create project'}
              />
            </div>
          </Form>
        </div>
      </div>
    </Modal.Modal>
  );
};

export default ProjectMetadataModal;
