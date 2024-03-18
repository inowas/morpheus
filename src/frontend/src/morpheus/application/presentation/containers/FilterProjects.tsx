import {ApplicationContentWrapper, Footer, Header, HeaderWrapper, IProjectCard, IPageWidth, ISortOption, ModelGrid, Navbar, ProjectsFilter, SortDropdown} from 'common/components';
import React, {useEffect, useState} from 'react';
import {useNavbarItems, useTranslate} from '../../application';
import {useLocation, useNavigate, useReleaseVersion} from 'common/hooks';

type ILanguageCode = 'de-DE' | 'en-GB';

const models: IProjectCard[] = [
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
  {
    projectId: 5,
    description: 'Introduction to cybersecurity and its applications',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    name: 'Cybersecurity Basics',
    model_Link: '/tools/06',
    model_map: '/tools/01',
    owner_avatar: '/author/AliceJohnson.jpeg',
    owner_name: 'Alice Johnson',
    meta_link: 'https://metaLink6',
    last_updated_at: '15.10.2023',
    status_color: true,
  },
  {
    projectId: 6,
    description: 'Discover the fundamentals of cloud computing',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    name: 'Cloud Computing Essentials',
    model_Link: '/tools/07',
    model_map: '/tools/01',
    owner_avatar: '/author/JamesSmith.jpeg',
    owner_name: 'James Smith',
    meta_link: 'https://metaLink7',
    last_updated_at: '05.01.2020',
    status_color: false,
  },
  {
    projectId: 7,
    description: 'Model description 1',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    name: 'Model Title 1',
    model_Link: '/tools/08',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink8',
    last_updated_at: '25.10.2023',
    status_color: true,
  },
  {
    projectId: 8,
    description: 'Model description 2',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    name: 'Model Title 2',
    model_Link: '/tools/09',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink9',
    last_updated_at: '27.10.2023',
    status_color: false,
  },
  {
    projectId: 9,
    description: 'Model description 3',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    name: 'Model Title 3',
    model_Link: '/tools/10',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink10',
    last_updated_at: '30.10.2023',
    status_color: true,
  },
  {
    projectId: 10,
    description: 'Model description 4',
    image: 'image_url_4.jpg',
    name: 'Model Title 4',
    model_Link: '/tools/11',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink11',
    last_updated_at: '02.10.2023',
    status_color: true,
  },
  {
    projectId: 11,
    description: 'Model description 5',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    name: 'Model Title 5',
    model_Link: '/tools/12',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink12',
    last_updated_at: '05.10.2023',
    status_color: false,
  },
  {
    projectId: 12,
    description: 'Exploring Advanced Data Structures',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    name: 'Advanced Data Structures',
    model_Link: '/tools/13',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink13',
    last_updated_at: '10.11.2023',
    status_color: true,
  },
  {
    projectId: 13,
    description: 'Introduction to Quantum Computing',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    name: 'Quantum Computing Basics',
    model_Link: '/tools/14',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink14',
    last_updated_at: '03.09.2023',
    status_color: false,
  },
  {
    projectId: 14,
    description: 'Optimizing Neural Network Architectures',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg',
    name: 'Neural Network Optimization',
    model_Link: '/tools/15',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink15',
    last_updated_at: '20.08.2023',
    status_color: true,
  },
  {
    projectId: 15,
    description: 'Advanced Algorithms in Computational Biology',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-0edbdfc7-9649-4070-bbc7-a004f5cbae63-thumb-8f988e39-d39d-44e1-a311-32a875cb3990.jpg',
    name: 'Computational Biology Algorithms',
    model_Link: '/tools/16',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink16',
    last_updated_at: '15.07.2023',
    status_color: false,
  },
  {
    projectId: 16,
    description: 'Introduction to Natural Language Processing',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-f1b69584-61c4-434f-9b81-f2272ec8e9ce-thumb-56626f85-c69e-4875-ac1c-a6d1cca81c5a.jpg',
    name: 'Natural Language Processing Basics',
    model_Link: '/tools/17',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink17',
    last_updated_at: '25.06.2023',
    status_color: true,
  },
  {
    projectId: 17,
    description: 'Exploring Big Data Management Techniques',
    image: 'https://datahub.inowas.com/uploaded/thumbs/map-fffea850-2cbf-4bff-a362-f19b899586d0-thumb-4cf377ab-8401-4204-a4b6-196a416180a2.jpg',
    name: 'Big Data Management',
    model_Link: '/tools/18',
    model_map: '/tools/01',
    owner_avatar: '/author/CatalinStefan.jpeg',
    owner_name: 'Catalin Stefan',
    meta_link: 'https://metaLink18',
    last_updated_at: '10.05.2023',
    status_color: false,
  },
];

const sortOptions: ISortOption[] = [
  {text: 'Most Recent', value: 'mostRecent'},
  {text: 'Less Recent', value: 'lessRecent'},
  {text: 'A-Z', value: 'aToZ'},
  {text: 'Z-A', value: 'zToA'},
];

const FilterProjects = () => {

  const {i18n, translate} = useTranslate();
  const {navbarItems} = useNavbarItems();
  const [language, setLanguage] = useState<ILanguageCode>(i18n.language as ILanguageCode);
  const navigateTo = useNavigate();
  const location = useLocation();
  const {release} = useReleaseVersion();

  const [modelData, setModelData] = useState(models);


  const pageSize: IPageWidth = 'auto';
  const [headerHeight, setHeaderHeight] = useState(0);
  const updateHeaderHeight = (height: number) => {
    setHeaderHeight(height);
  };

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const languageList: { code: ILanguageCode; label: string }[] = [
    {
      code: 'en-GB',
      label: 'English',
    },
  ];

  const updateModelData = (newData: IProjectCard[]) => {
    setModelData(newData);
  };

  const sectionTitle = () => {
    if (1 === modelData.length) {
      return (<><span>1</span> {translate('Model found')}</>);
    } else {
      return (<><span>{modelData.length}</span> {translate('Models found')}</>);
    }
  };

  const handleCopyButtonClick = (id: number) => {
    // Handle copy functionality here
    console.log(`Copy button clicked for ID: ${id}`);
  };

  return (
    <>
      <HeaderWrapper updateHeight={updateHeaderHeight}>
        <Header
          navigateTo={navigateTo}
          language={language}
          languageList={languageList}
          onChangeLanguage={setLanguage}
        />
        <Navbar
          pathname={location.pathname}
          navbarItems={navbarItems}
          navigateTo={navigateTo}
          showSearchWrapper={true}
          showCreateButton={true}
        />
      </HeaderWrapper>

      <ApplicationContentWrapper
        headerHeight={headerHeight}
        open={true}
        maxWidth={350}
        menuItems={[]}
      >
        <ProjectsFilter data={modelData} updateModelData={updateModelData}/>
        <SortDropdown
          placeholder="Order By"
          sortOptions={sortOptions}
          data={modelData}
          setModelData={setModelData}
        >
          <ModelGrid
            sectionTitle={sectionTitle()}
            data={modelData}
            handleCopyButtonClick={handleCopyButtonClick}
          />
        </SortDropdown>
      </ApplicationContentWrapper>
      <Footer release={release} maxWidth={pageSize}/>
    </>
  );
};

export default FilterProjects;
