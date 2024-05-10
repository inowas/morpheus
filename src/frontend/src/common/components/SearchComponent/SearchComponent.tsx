import React, {useState} from 'react';
import {Button, Search, SearchProps} from 'semantic-ui-react';
import styles from './SearchComponent.module.less';

interface ISearchComponentProps {
  results?: { title: string }[];
  loading?: boolean;
  placeholder?: string;
  buttonText?: string;
  onSearch: (searchTerm: string) => void;
}

const SearchComponent = ({results = [], loading = false, placeholder, buttonText, onSearch}: ISearchComponentProps) => {
  const [value, setValue] = useState('');

  const handleSearchChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, data: SearchProps) => {
    setValue(data.value as string);
    if (!buttonText) {
      onSearch(data.value as string);
    }
  };

  const handleButtonClick = () => {
    onSearch(value);
    setValue('');
  };

  return (
    <div className={styles.searchWrapper}>
      {buttonText && (
        <Button
          size="small"
          primary={true}
          onClick={handleButtonClick}
          className={styles.button}

        >
          {buttonText}
        </Button>
      )}
      <Search
        icon={false}
        className={styles.search}
        loading={loading}
        placeholder={placeholder ? placeholder : 'Search...'}
        onSearchChange={handleSearchChange}
        value={value}
        results={results}
      />
    </div>
  );
};

export default SearchComponent;
