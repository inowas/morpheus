// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React, {useState} from 'react';
import SearchInput from './SearchInput';
import {Button} from 'semantic-ui-react';
import DropdownComponent from '../Dropdown';

export default {
  title: 'SearchInput',
  component: SearchInput,
} as Meta<typeof SearchInput>;

export const SearchComponentExample: StoryFn<typeof SearchInput> = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ title: string; }[]>([]);
  const handleSearchChange = (searchTerm: string) => {
    setLoading(true);

    setTimeout(() => {
      const searchResults = [
        {title: 'Result 1'},
        {title: 'Result 2'},
        {title: 'Result 3'},
      ];

      setResults(searchResults);
      setLoading(false); // Reset loading state after fetching results
    }, 300); // Simulating 300ms delay
  };

  const dropdownItems = [
    {text: 'Item 1', action: () => ({})},
    {text: 'Item 2', action: () => ({})},
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <SearchInput
        placeholder={'Search...'}
        search={''}
        onChange={handleSearchChange}
      >
        <Button
          data-testid='test-search-component'
          text={'123'}
          icon='upload'
          floating={true}
          labeled={true}
          button={true}
          content={'Import'}
        />
        <DropdownComponent.Dropdown
          data-testid='test-search-component'
          text={'Draw on map'}
          icon='pencil'
          floating={true}
          labeled={true}
          button={true}
          className='icon'
        >
          <DropdownComponent.Menu>
            {dropdownItems.map((item, key) => (
              <DropdownComponent.Item key={key} onClick={item.action}>{item.text}</DropdownComponent.Item>
            ))}
          </DropdownComponent.Menu>
        </DropdownComponent.Dropdown>
      </SearchInput>
    </div>
  );
};
