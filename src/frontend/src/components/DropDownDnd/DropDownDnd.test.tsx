import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import DropDownDnd from './DropDownDnd';
import {Segment} from 'semantic-ui-react';

describe('DropdownDnd Tests', () => {
  test('It renders closed component correctly', async () => {
    const selectedFields = [
      {key: 'id', label: 'ID', visible: true},
      {key: 'name', label: 'Name', visible: false},
      {key: 'description', label: 'Description', visible: true},
      {key: 'created_at', label: 'Created At', visible: false},
    ];

    render(
      <Segment
        raised={true}
        style={{paddingLeft: 250, paddingBottom: 450}}
      >
        <DropDownDnd
          items={selectedFields}
          getId={item => item.key}
          getLabel={(field => field.label)}
          isChecked={(field => field.visible)}
          setChecked={((field, visible) => ({...field, visible}))}
          onClick={jest.fn()}
          onChange={jest.fn()}
          isOpen={false}
        />
      </Segment>,
    );

    expect(screen.getByTestId('dropdown-dnd')).toBeInTheDocument();
    expect(screen.getByRole('listbox', {expanded: false}));
  });

  test('It renders opened component correctly', async () => {
    const selectedFields = [
      {key: 'id', label: 'ID', visible: true},
      {key: 'name', label: 'Name', visible: false},
      {key: 'description', label: 'Description', visible: true},
      {key: 'created_at', label: 'Created At', visible: false},
    ];

    render(
      <Segment
        raised={true}
        style={{paddingLeft: 250, paddingBottom: 450}}
      >
        <DropDownDnd
          items={selectedFields}
          getId={item => item.key}
          getLabel={(field => field.label)}
          isChecked={(field => field.visible)}
          setChecked={((field, visible) => ({...field, visible}))}
          onClick={jest.fn()}
          onChange={jest.fn()}
          isOpen={true}
        />
      </Segment>,
    );

    expect(screen.getByTestId('dropdown-dnd')).toBeInTheDocument();
    expect(screen.getByRole('listbox', {expanded: true}));
  });

  test('It executes onClick Callback', async () => {
    const selectedFields = [
      {key: 'id', label: 'ID', visible: true},
      {key: 'name', label: 'Name', visible: false},
      {key: 'description', label: 'Description', visible: true},
      {key: 'created_at', label: 'Created At', visible: false},
    ];

    const onClick = jest.fn();

    render(
      <Segment
        raised={true}
        style={{paddingLeft: 250, paddingBottom: 450}}
      >
        <DropDownDnd
          items={selectedFields}
          getId={item => item.key}
          getLabel={(field => field.label)}
          isChecked={(field => field.visible)}
          setChecked={((field, visible) => ({...field, visible}))}
          onClick={onClick}
          onChange={jest.fn()}
          isOpen={false}
        />
      </Segment>,
    );

    const dropdown = screen.getByTestId('dropdown-dnd');
    expect(dropdown).toBeInTheDocument();
    fireEvent.click(dropdown);
    expect(onClick).toHaveBeenCalledWith(true);
  });

  test('It executes onRow click properly', async () => {
    const selectedFields = [
      {key: 'id', label: 'ID', visible: true},
      {key: 'name', label: 'Name', visible: false},
      {key: 'description', label: 'Description', visible: true},
      {key: 'created_at', label: 'Created At', visible: false},
    ];

    const setChecked = jest.fn();
    const onChange = jest.fn();

    render(
      <Segment
        raised={true}
        style={{paddingLeft: 250, paddingBottom: 450}}
      >
        <DropDownDnd
          items={selectedFields}
          getId={item => item.key}
          getLabel={(field => field.label)}
          isChecked={(field => field.visible)}
          setChecked={setChecked}
          onClick={jest.fn()}
          onChange={onChange}
          isOpen={false}
        />
      </Segment>,
    );

    const rows = screen.getAllByTestId('dropdown-dnd-list-item');
    rows.forEach(row => fireEvent.click(row));
    expect(setChecked).toBeCalledTimes(4);
    expect(onChange).toBeCalledTimes(4);
  });
});
