import {
  CardGrid,
  ContentWrapper,
  Header,
  ICard,
  ISortOption,
  Navbar,
  ProjectsFilter,
  SortDropdown,
} from "common/components";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";
import "../globals.less";
import { useTranslate } from "../../../morpheus/modflow/application";
import {
  ModflowContainer,
  SidebarContent,
} from "../../../morpheus/modflow/presentation/components";

const navbarItems = [
  {
    name: "home",
    label: "Home",
    admin: false,
    basepath: "/",
    subMenu: [
      {
        name: "T02",
        label: "T02: Groundwater Mounding (Hantush)",
        admin: false,
        to: "/tools/T02",
      },
      {
        name: "T04",
        label: "T04: Database for GIS-based Suitability Mapping",
        admin: false,
        to: "/tools/T04",
      },
    ],
  },
  { name: "filters", label: "Filters", admin: false, to: "/tools" },
  {
    name: "documentation",
    label: "Documentation",
    admin: false,
    to: "/modflow",
  },
];

const projects: ICard[] = [
  {
    key: "d734ec7e-3abb-4718-be07-71c89134bc51",
    title: "Project Name 0",
    description: "Project Description 0",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "30.05.2023",
    onViewClick: () => console.log("View", "Project Name 0"),
    onDeleteClick: () => console.log("Delete", "Project Name 0"),
    onCopyClick: () => console.log("Copy", "Project Name 0"),
  },
  {
    key: "f60b8894-b5fd-4ec6-b99b-70ac3b4b7c99",
    title: "Project Name 1",
    description: "Project Description 1",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "24.03.2023",
    onViewClick: () => console.log("View", "Project Name 1"),
    onDeleteClick: () => console.log("Delete", "Project Name 1"),
    onCopyClick: () => console.log("Copy", "Project Name 1"),
  },
  {
    key: "10f70ffd-bbb0-49cd-8d65-10f52dfb7559",
    title: "Project Name 2",
    description: "Project Description 2",
    status: "green",
    date_time: "03.03.2024",
    onViewClick: () => console.log("View", "Project Name 2"),
    onDeleteClick: () => console.log("Delete", "Project Name 2"),
    onCopyClick: () => console.log("Copy", "Project Name 2"),
  },
  {
    key: "b4493378-47f5-4042-bc07-73f632a57953",
    title: "Project Name 3",
    description: "Project Description 3",
    status: "green",
    date_time: "30.10.2023",
  },
  {
    key: "7617c29b-e656-481f-bf95-afb32a8b513a",
    title: "Project Name 4",
    description: "Project Description 4",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "20.05.2023",
  },
  {
    key: "f2184f6a-b64b-4f9a-805a-32f7d53ab729",
    title: "Project Name 5",
    description: "Project Description 5",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "13.10.2023",
    onViewClick: () => console.log("View", "Project Name 5"),
    onDeleteClick: () => console.log("Delete", "Project Name 5"),
    onCopyClick: () => console.log("Copy", "Project Name 5"),
  },
  {
    key: "9a14ea45-4e62-457e-8881-0b43f48e8bae",
    title: "Project Name 6",
    description: "Project Description 6",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "02.09.2023",
  },
  {
    key: "7444e9ce-1b97-421b-9312-88031e584e9a",
    title: "Project Name 7",
    description: "Project Description 7",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "02.03.2024",
  },
  {
    key: "82c19560-cc1e-43c0-ab3f-871c70ded456",
    title: "Project Name 8",
    description: "Project Description 8",
    status: "green",
    date_time: "23.06.2023",
    onViewClick: () => console.log("View", "Project Name 8"),
    onDeleteClick: () => console.log("Delete", "Project Name 8"),
  },
  {
    key: "a210b946-d534-4df1-a884-ac5047d66b45",
    title: "Project Name 9",
    description: "Project Description 9",
    status: "green",
    date_time: "06.04.2023",
  },
  {
    key: "93d19269-1c4c-4167-8c45-30f42db2eaeb",
    title: "Project Name 10",
    description: "Project Description 10",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "04.08.2023",
    onViewClick: () => console.log("View", "Project Name 10"),
    onDeleteClick: () => console.log("Delete", "Project Name 10"),
    onCopyClick: () => console.log("Copy", "Project Name 10"),
  },
  {
    key: "7b599b34-d0c8-41df-9fb2-0463f26f6663",
    title: "Project Name 11",
    description: "Project Description 11",
    status: "green",
    date_time: "21.07.2023",
  },
  {
    key: "160be895-60ff-4bae-9da3-172d66b435eb",
    title: "Project Name 12",
    description: "Project Description 12",
    status: "green",
    date_time: "23.04.2023",
  },
  {
    key: "18bb774d-4b2b-45e0-b8b9-f9881a7af1a2",
    title: "Project Name 13",
    description: "Project Description 13",
    status: "green",
    date_time: "02.09.2023",
  },
  {
    key: "251046ae-2574-4c26-98d2-e472efd0d615",
    title: "Project Name 14",
    description: "Project Description 14",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "22.02.2024",
  },
  {
    key: "f569aaf7-ca5d-4c6d-8ea5-f5df5caf974c",
    title: "Project Name 15",
    description: "Project Description 15",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "03.05.2023",
  },
  {
    key: "a5a879b3-6dcb-486d-a856-05a36501fcf2",
    title: "Project Name 16",
    description: "Project Description 16",
    status: "green",
    date_time: "09.11.2023",
  },
  {
    key: "9414cc06-bc53-4182-8939-40c0cbe2fddd",
    title: "Project Name 17",
    description: "Project Description 17",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "10.09.2023",
    onViewClick: () => console.log("View", "Project Name 17"),
    onCopyClick: () => console.log("Copy", "Project Name 17"),
  },
  {
    key: "270003b2-702a-4a32-8e50-9eb68de5807b",
    title: "Project Name 18",
    description: "Project Description 18",
    image:
      "https://datahub.inowas.com/uploaded/thumbs/map-5f79bb9b-e8a8-4219-b78e-494b7b17120c-thumb-cab25e87-6b4a-4574-ad08-9ae20e77ba2d.jpg",
    status: "green",
    date_time: "29.07.2023",
  },
];

const sortOptions: ISortOption[] = [
  { text: "Most Recent", value: "mostRecent" },
  { text: "Less Recent", value: "lessRecent" },
  { text: "A-Z", value: "aToZ" },
  { text: "Z-A", value: "zToA" },
];

const location = {
  hash: "",
  key: "k7tdeakh",
  pathname: "/",
  search: "",
  state: null,
};

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Modflow/ProjectsFilter",
  component: ProjectsFilter,
} as Meta<typeof ProjectsFilter>;

export const FormFilterExample: StoryFn<typeof ProjectsFilter> = () => {
  const [cards, setCards] = useState<ICard[]>(projects);

  const updateModelData = (newData: ICard[]) => {
    setCards(newData);
  };

  return (
    <div style={{ paddingLeft: "1rem", backgroundColor: "#eeeeee" }}>
      <ProjectsFilter
        data={cards}
        updateModelData={updateModelData}
        style={{ padding: "1rem" }}
      />
    </div>
  );
};

export const FormFilterPageExample: StoryFn<typeof ProjectsFilter> = () => {
  const [cards, setCards] = useState<ICard[]>(projects);

  const { translate } = useTranslate();

  return (
    <div style={{ margin: "-1rem" }}>
      <Header navigateTo={() => {}} />
      <Navbar
        location={location}
        navbarItems={navbarItems}
        navigateTo={() => {}}
        showSearchWrapper={false}
        showCreateButton={false}
      />
      <ModflowContainer>
        <SidebarContent maxWidth={350}>
          <div style={{ padding: 20 }}>
            <h3>{translate("Projects filter")}</h3>
          </div>
        </SidebarContent>
        <ContentWrapper style={{ position: "relative" }}>
          <SortDropdown
            placeholder="Order By"
            setModelData={setCards}
            sortOptions={sortOptions}
            data={cards}
            style={{
              position: "absolute",
              top: 20,
              right: 50,
              zIndex: 10,
            }}
          />
          <CardGrid
            cards={cards}
            title={
              <>
                <span>{cards.length}</span> {translate("Projects found")}
              </>
            }
          />
        </ContentWrapper>
      </ModflowContainer>
    </div>
  );
};
