import SortDropdown, {ISortOption} from 'common/components/SortDropdown';
import {render, screen} from '@testing-library/react';

import {IProjectCard} from 'common/components/ModelCard';
import React from 'react';
import userEvent from '@testing-library/user-event';

const mockSetModelData = jest.fn();

const sortOptions: ISortOption[] = [
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
];

const modelData: IProjectCard[] = [
  {
    projectId: 0,
    description: 'A comprehensive guide to React development',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    name: 'React Mastery: The Complete Guide',
    model_Link: '/tools/01',
    model_map: '/tools/01',
    owner_avatar: '/author/JohnDoe.jpeg',
    owner_name: 'John Doe',
    meta_link: 'https://metaLink1',
    last_updated_at: '20.11.2023',
    status_color: false,
  },
  {
    projectId: 1,
    description: 'Explore the world of machine learning with Python',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    name: 'Machine Learning with Python',
    model_Link: '/tools/02',
    model_map: '/tools/01',
    owner_avatar: '/author/JaneSmith.jpeg',
    owner_name: 'Jane Smith',
    meta_link: 'https://metaLink2',
    last_updated_at: '20.11.2023',
    status_color: false,
  },
  {
    projectId: 2,
    description: 'Base model in the Ezousa valley',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    name: 'Ezousa MAR site',
    model_Link: '/tools/03',
    model_map: '/tools/01',
    owner_avatar: '/author/RobertJohnson.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink3',
    last_updated_at: '20.11.2023',
    status_color: true,
  },
  {
    projectId: 3,
    description: 'Small model at NU campus',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    name: 'Simulation ofSUDS impact',
    model_Link: '/tools/04',
    model_map: '/tools/01',
    owner_avatar: '/author/EmilyBrown.jpeg',
    owner_name: 'Emily Brown',
    meta_link: 'https://metaLink4',
    last_updated_at: '20.11.2023',
    status_color: true,
  },
  {
    projectId: 4,
    description: 'Explore the world of data science and analytics',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    name: 'Data Science Foundations',
    model_Link: '/tools/05',
    model_map: '/tools/01',
    owner_avatar: '/author/DavidWilson.jpeg',
    owner_name: 'David Wilson',
    meta_link: 'https://metaLink5',
    last_updated_at: '01.11.2023',
    status_color: true,
  },
];

describe('Sort Dropdown Tests', () => {
  test('It renders the Sort Dropdown component', () => {
    render(
      <SortDropdown
        placeholder="Order By"
        sortOptions={sortOptions}
        data={modelData}
        setModelData={mockSetModelData}
      ><h1>Children</h1></SortDropdown>,
    );

    expect(screen.getByTestId('sort-dropdown-container')).toBeInTheDocument();
  });

  test('It sorts data when a sort option is selected', async () => {
    render(
      <SortDropdown
        placeholder="Order By"
        sortOptions={sortOptions}
        data={modelData}
        setModelData={mockSetModelData}
      ><h1>Children</h1></SortDropdown>,
    );

    // Find the dropdown and select an option
    const dropdown = screen.getByTestId('sort-dropdown');
    await userEvent.click(dropdown);

    const sortByaToZ = screen.getByText('A-Z', {selector: 'span'});
    await userEvent.click(sortByaToZ);

    // Verify if setModelData is called with the expected sorted data
    expect(mockSetModelData).toHaveBeenCalledWith([
      {
        id: 4,
        model_description: 'Explore the world of data science and analytics',
        model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
        model_title: 'Data Science Foundations',
        model_Link: '/tools/05',
        model_map: '/tools/01',
        meta_author_avatar: '/author/DavidWilson.jpeg',
        meta_author_name: 'David Wilson',
        meta_link: 'https://metaLink5',
        meta_text: '01.11.2023',
        meta_status: true,
      },
      {
        id: 2,
        model_description: 'Base model in the Ezousa valley',
        model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
        model_title: 'Ezousa MAR site',
        model_Link: '/tools/03',
        model_map: '/tools/01',
        meta_author_avatar: '/author/RobertJohnson.jpeg',
        meta_author_name: 'Catalin Stefan',
        meta_link: 'https://metaLink3',
        meta_text: '20.11.2023',
        meta_status: true,
      },
      {
        id: 1,
        model_description: 'Explore the world of machine learning with Python',
        model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
        model_title: 'Machine Learning with Python',
        model_Link: '/tools/02',
        model_map: '/tools/01',
        meta_author_avatar: '/author/JaneSmith.jpeg',
        meta_author_name: 'Jane Smith',
        meta_link: 'https://metaLink2',
        meta_text: '20.11.2023',
        meta_status: false,
      },
      {
        id: 0,
        model_description: 'A comprehensive guide to React development',
        model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
        model_title: 'React Mastery: The Complete Guide',
        model_Link: '/tools/01',
        model_map: '/tools/01',
        meta_author_avatar: '/author/JohnDoe.jpeg',
        meta_author_name: 'John Doe',
        meta_link: 'https://metaLink1',
        meta_text: '20.11.2023',
        meta_status: false,
      },
      {
        id: 3,
        model_description: 'Small model at NU campus',
        model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
        model_title: 'Simulation ofSUDS impact',
        model_Link: '/tools/04',
        model_map: '/tools/01',
        meta_author_avatar: '/author/EmilyBrown.jpeg',
        meta_author_name: 'Emily Brown',
        meta_link: 'https://metaLink4',
        meta_text: '20.11.2023',
        meta_status: true,
      },
    ]);
  });
});

