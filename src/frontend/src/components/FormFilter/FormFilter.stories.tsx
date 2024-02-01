import React, {useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Meta, StoryFn} from '@storybook/react';
import {FormFilter, Header, IModelCard, IPageWidth, ISortOption, ModelGrid, Sidebar, SortDropdown} from 'components';
import '../../morpheus/morpheus.less';
import 'react-datepicker/dist/react-datepicker.css';
import '../rc-slider.css';

const models: IModelCard[] = [
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
    id: 5,
    model_description: 'Introduction to cybersecurity and its applications',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    model_title: 'Cybersecurity Basics',
    model_Link: '/tools/06',
    model_map: '/tools/01',
    meta_author_avatar: '/author/AliceJohnson.jpeg',
    meta_author_name: 'Alice Johnson',
    meta_link: 'https://metaLink6',
    meta_text: '15.10.2023',
    meta_status: true,
  },
  {
    id: 6,
    model_description: 'Discover the fundamentals of cloud computing',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    model_title: 'Cloud Computing Essentials',
    model_Link: '/tools/07',
    model_map: '/tools/01',
    meta_author_avatar: '/author/JamesSmith.jpeg',
    meta_author_name: 'James Smith',
    meta_link: 'https://metaLink7',
    meta_text: '05.01.2020',
    meta_status: false,
  },
  {
    id: 7,
    model_description: 'Model description 1',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'Model Title 1',
    model_Link: '/tools/08',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink8',
    meta_text: '25.10.2023',
    meta_status: true,
  },
  {
    id: 8,
    model_description: 'Model description 2',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    model_title: 'Model Title 2',
    model_Link: '/tools/09',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink9',
    meta_text: '27.10.2023',
    meta_status: false,
  },
  {
    id: 9,
    model_description: 'Model description 3',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    model_title: 'Model Title 3',
    model_Link: '/tools/10',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink10',
    meta_text: '30.10.2023',
    meta_status: true,
  },
  {
    id: 10,
    model_description: 'Model description 4',
    model_image: 'image_url_4.jpg',
    model_title: 'Model Title 4',
    model_Link: '/tools/11',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink11',
    meta_text: '02.10.2023',
    meta_status: true,
  },
  {
    id: 11,
    model_description: 'Model description 5',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    model_title: 'Model Title 5',
    model_Link: '/tools/12',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink12',
    meta_text: '05.10.2023',
    meta_status: false,
  },
  {
    id: 12,
    model_description: 'Exploring Advanced Data Structures',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    model_title: 'Advanced Data Structures',
    model_Link: '/tools/13',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink13',
    meta_text: '10.11.2023',
    meta_status: true,
  },
  {
    id: 13,
    model_description: 'Introduction to Quantum Computing',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    model_title: 'Quantum Computing Basics',
    model_Link: '/tools/14',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink14',
    meta_text: '03.09.2023',
    meta_status: false,
  },
  {
    id: 14,
    model_description: 'Optimizing Neural Network Architectures',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    model_title: 'Neural Network Optimization',
    model_Link: '/tools/15',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink15',
    meta_text: '20.08.2023',
    meta_status: true,
  },
  {
    id: 15,
    model_description: 'Advanced Algorithms in Computational Biology',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    model_title: 'Computational Biology Algorithms',
    model_Link: '/tools/16',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink16',
    meta_text: '15.07.2023',
    meta_status: false,
  },
  {
    id: 16,
    model_description: 'Introduction to Natural Language Processing',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    model_title: 'Natural Language Processing Basics',
    model_Link: '/tools/17',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink17',
    meta_text: '25.06.2023',
    meta_status: true,
  },
  {
    id: 17,
    model_description: 'Exploring Big Data Management Techniques',
    model_image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    model_title: 'Big Data Management',
    model_Link: '/tools/18',
    model_map: '/tools/01',
    meta_author_avatar: '/author/CatalinStefan.jpeg',
    meta_author_name: 'Catalin Stefan',
    meta_link: 'https://metaLink18',
    meta_text: '10.05.2023',
    meta_status: false,
  },
];

const navbarItems2 = [
  {
    name: 'home', label: 'Home', admin: false, basepath: '/', subMenu: [
      {name: 'T02', label: 'T02: Groundwater Mounding (Hantush)', admin: false, to: '/tools/T02'},
      {name: 'T04', label: 'T04: Database for GIS-based Suitability Mapping', admin: false, to: '/tools/T04'}],
  },
  {name: 'filters', label: 'Filters', admin: false, to: '/tools'},
  {name: 'documentation', label: 'Documentation', admin: false, to: '/modflow'},
];

const sortOptions: ISortOption[] = [
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
];

const pageSize: IPageWidth = 'auto';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Modflow/FormFilter',
  component: FormFilter,
} as Meta<typeof FormFilter>;

export const FormFilterExample: StoryFn<typeof FormFilter> = () => {
  const [modelData, setModelData] = useState(models);

  const updateModelData = (newData: IModelCard[]) => {
    setModelData(newData);
  };

  return (
    <div style={{paddingLeft: '1rem', backgroundColor: '#eeeeee'}}>
      <FormFilter data={modelData} updateModelData={updateModelData}/>
    </div>
  );
};

export const FormFilterPageExample: StoryFn<typeof FormFilter> = () => {
  const [modelData, setModelData] = useState(models);
  const [headerHeight, setHeaderHeight] = useState(0);

  const updateModelData = (newData: IModelCard[]) => {
    setModelData(newData);
  };

  const sectionTitle = () => {
    if (1 === modelData.length) {
      return (<><span>1</span> Model found </>);
    } else {
      return (<><span>{modelData.length}</span> Models found</>);
    }
  };

  const handleCopyButtonClick = (id: number) => {
    // Handle copy functionality here
    console.log(`Copy button clicked for ID: ${id}`);
  };


  return (
    <div style={{margin: '-1rem'}}>
      <Header
        maxWidth={pageSize}
        navbarItems={navbarItems2}
        navigateTo={() => {
        }}
        pathname={'/'}
        showSearchWrapper={true}
        showSidebarMenu={false}
        updateHeight={(height: number) => {
        }}
      />
      <Sidebar
        headerHeight={headerHeight} open={true}
        maxWidth={350}
      >
        <FormFilter data={modelData} updateModelData={updateModelData}/>
        <SortDropdown
          placeholder="Order By"
          sortOptions={sortOptions}
          data={modelData}
          setModelData={setModelData}
        >
          <ModelGrid
            sectionTitle={sectionTitle()}
            data={modelData}
            navigateTo={() => {
              console.log('Click on navigate');
            }}
            handleCopyButtonClick={handleCopyButtonClick}
          />
        </SortDropdown>
      </Sidebar>
    </div>
  );
};
