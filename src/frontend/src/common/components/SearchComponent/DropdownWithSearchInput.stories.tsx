// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React, {useState} from 'react';
import DropdownWithSearchInput from './DropdownWithSearchInput';

export default {
  title: 'SearchComponent',
  component: DropdownWithSearchInput,
} as Meta<typeof DropdownWithSearchInput>;

export const SearchComponentExample: StoryFn<typeof DropdownWithSearchInput> = () => {
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

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <DropdownWithSearchInput
        dropDownText={'Add new boundary'}
        searchPlaceholder={'Search...'}
        onChangeSearch={handleSearchChange}
        dropdownItems={[
          {text: 'Item 1', action: () => ({})},
          {text: 'Item 2', action: () => ({})},
        ]}
        isReadOnly={false}
      />
    </div>
  );
};
