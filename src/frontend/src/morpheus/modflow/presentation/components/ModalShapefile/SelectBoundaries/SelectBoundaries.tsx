import React from 'react';
import {Checkbox, Form, List, ListItem, Select} from 'semantic-ui-react';

import styles from './SelectBoundaries.module.less';


interface ISelectBoundaries {
  layers: { id: string; name: string }[];
}

const SelectBoundaries = ({layers}: ISelectBoundaries) => {
  const columnOptions = [
    {key: 'select', text: 'Select column', value: ''},
    ...layers.map(value => ({key: value.id, text: value.name, value: value.id})),
  ];

  return (
    <div className={styles.wrapper}>
      <Form className={styles.filter}>
        <div className={styles.header}>
          <Checkbox
            name={'sellect all'}
          />
          <Select
            placeholder='Select column'
            options={columnOptions}
          />
        </div>
        <List className={styles.list}>
          {layers.map(value => (
            <ListItem key={value.id} className={styles.listItem}>
              <Checkbox
                className={styles.checkbox}
                label={value.name}
                name={value.name}
              />
            </ListItem>
          ))}
        </List>
      </Form>

    </div>

  );
};

export default SelectBoundaries;
