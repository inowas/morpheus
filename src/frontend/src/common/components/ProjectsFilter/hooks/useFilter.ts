import {useEffect, useState} from 'react';

import {IFilterOptions} from '../types/ProjectsFilter.type';
import {IProjectCard} from '../../ModelCard';

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}.${day}.${year}`;
};

const useFilterOptions = (data: IProjectCard[], updateModelData: (data: IProjectCard[]) => void, userName: string, defaultFilterOptions: IFilterOptions) => {
  const [modelData, setModelData] = useState<IProjectCard[]>(data);
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>(defaultFilterOptions);

  const applyFilters = () => {

    let filteredData = [...modelData];

    if (filterOptions.myModels) {
      filteredData = filteredData.filter((model) => model.meta_author_name === userName);
    }

    if (filterOptions.calculationsFinalized && !filterOptions.calculationsNotFinalized) {
      filteredData = filteredData.filter((model) => model.meta_status);
    }

    if (filterOptions.calculationsNotFinalized && !filterOptions.calculationsFinalized) {
      filteredData = filteredData.filter((model) => !model.meta_status);
    }

    if (0 < filterOptions.selectedOwners.length) {
      filteredData = filteredData.filter((model) =>
        filterOptions.selectedOwners.includes(model.meta_author_name),
      );
    }

    if (0 < filterOptions.selectedKeywords.length) {
      const keywords = filterOptions.selectedKeywords.map((keyword) => keyword.toLowerCase());
      filteredData = filteredData.filter((model) =>
        keywords.some((key) =>
          model.model_description.toLowerCase().includes(key) || model.model_title.toLowerCase().includes(key),
        ),
      );
    }
    updateModelData(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filterOptions]);

  const handleFilterChange = (fieldName: string, value: boolean) => {

    setFilterOptions({
      ...filterOptions,
      [fieldName]: value,
    });
  };

  const handleDropdownChange = (fieldName: string, selectedOptions: any[]) => {
    setFilterOptions({
      ...filterOptions,
      [fieldName]: selectedOptions,
    });
  };

  const handleRadioChange = (fieldName: string) => {
    // Update the filterOptions based on the selected date type
    setFilterOptions({
      ...filterOptions,
      modifiedDate: 'modified' === fieldName,
      createdDate: 'created' === fieldName,
      modelDate: 'model' === fieldName,
    });
  };

  const handleBoundaryChange = (fieldName: string, checked: boolean) => {
    setFilterOptions({
      ...filterOptions,
      boundaryValues: {
        ...filterOptions.boundaryValues,
        [fieldName]: checked,
      },
    });
  };

  const handleAdditionalFeaturesChange = (fieldName: string, checked: boolean) => {
    setFilterOptions({
      ...filterOptions,
      additionalFeatures: {
        ...filterOptions.additionalFeatures,
        [fieldName]: checked,
      },
    });
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      setFilterOptions({
        ...filterOptions,
        [name]: formatDate(date),
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        [name]: '',
      });
    }
  };

  const handleSlider = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setFilterOptions({
        ...filterOptions,
        gridCellsValue: value[0],
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        gridCellsValue: value,
      });
    }
  };

  const handleClearFilters = () => {
    updateModelData(data);
    setFilterOptions(defaultFilterOptions);
  };


  return {
    filterOptions,
    handleRadioChange,
    handleFilterChange,
    handleDropdownChange,
    handleBoundaryChange,
    handleAdditionalFeaturesChange,
    handleDateChange,
    handleSlider,
    handleClearFilters,
  };
};

export default useFilterOptions;
