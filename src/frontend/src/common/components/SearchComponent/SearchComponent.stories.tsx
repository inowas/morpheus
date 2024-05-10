// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import React, {useState} from 'react';
import SearchComponent from './SearchComponent';

export default {
  title: 'SearchComponent',
  component: SearchComponent,
} as Meta<typeof SearchComponent>;

export const SearchComponentExample: StoryFn<typeof SearchComponent> = () => {
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
      <SearchComponent
        loading={loading}
        results={results}
        onSearch={handleSearchChange}
        buttonText={'Add new boundary'}
      />
      <SearchComponent
        loading={loading}
        results={results}
        onSearch={handleSearchChange}
      />
    </div>
  );
};
