import {
  Button,
  InfoTitle,
  MovableAccordionList,
  Tab,
} from "common/components";
import { Icon, MenuItem, TabPane } from "semantic-ui-react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "MovableAccordionList",
  component: MovableAccordionList,
} as Meta<typeof MovableAccordionList>;

const wrapper: React.CSSProperties = {
  padding: "50px",
  backgroundColor: "#eeeeee",
};

const movableItems: any[] = [
  {
    key: 12312,
    title: {
      content: "Top layer",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>Top layer</h2>
          <p>Tab 1 Content</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
  {
    key: 223213,
    title: {
      content: "Some clay-silt lenses",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>Some clay-silt lenses</h2>
          <p>Tab 2 Content</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam
          </p>
        </div>
      ),
    },
  },
  {
    key: 32131232,
    title: {
      content: "New Content 3",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 3</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
    isOpen: false,
  },
  {
    key: 123124,
    title: {
      content: "New Content 4",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 4</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
  {
    key: 123125,
    title: {
      content: "New Content 5",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 5</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
  {
    key: 123126,
    title: {
      content: "New Content 6",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 6</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. ...</p>
        </div>
      ),
    },
  },
  {
    key: 123135,
    title: {
      content: "New Content 14",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 14</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
];

const tabPanelsPrimary = [
  {
    menuItem: "Upload shapefile",
    render: () => <TabPane attached={false}>Upload shapefile</TabPane>,
  },
  {
    menuItem: "Polygons",
    render: () => <TabPane attached={false}>Polygons</TabPane>,
  },
];

const tabPanelsSecondary = [
  {
    menuItem: "Layer properties",
    render: () => <TabPane></TabPane>,
  },
  {
    menuItem: "Confinement",
    render: () => (
      <TabPane>
        <InfoTitle
          title="Upload shapefile"
          description="Shapefile description"
          actionText="Add on map"
          actionDescription="Action description"
          onAction={() => {
            console.log("Add on map action");
          }}
        />
        <Button size={"tiny"}>Choose file</Button>
        <InfoTitle title="Upload raster" description="raster description" />
        <Button size={"tiny"}>Choose file</Button>
      </TabPane>
    ),
  },
  {
    menuItem: "Top elevation",
    render: () => (
      <TabPane>
        <Tab
          variant="primary"
          menu={{ secondary: true, pointing: true }}
          panes={tabPanelsPrimary}
        />
      </TabPane>
    ),
  },
  {
    menuItem: "Bottom elevation",
    render: () => <TabPane>Tab 3 Content</TabPane>,
  },
  {
    menuItem: "Hydraulic conductivity along rows",
    render: () => <TabPane>Tab 4 Content</TabPane>,
  },
  {
    menuItem: "Horizontal hydraulic anisotropy",
    render: () => <TabPane>Tab 5 Content</TabPane>,
  },
  {
    menuItem: "Vertical hydraulic conductivity",
    render: () => <TabPane>Tab 6 Content</TabPane>,
  },
  {
    menuItem: "Specific storage",
    render: () => <TabPane>Tab 7 Content</TabPane>,
  },
  {
    menuItem: "Specific yield",
    render: () => <TabPane>Tab 8 Content</TabPane>,
  },
  { menuItem: "Starting head", render: () => <TabPane>Tab 9 Content</TabPane> },
  { menuItem: "iBound", render: () => <TabPane>Tab 10 Content</TabPane> },
];

const movableItemsWithTabs: any[] = [
  {
    key: 12312,
    title: {
      content: "Tabs inside",
      icon: false,
    },
    content: {
      content: (
        <div className={"scrollWrapper-Y"}>
          <Tab
            variant="secondary"
            title={true}
            defaultActiveIndex={1}
            grid={{ rows: 1, columns: 2 }}
            menu={{ fluid: true, vertical: true, tabular: true }}
            panes={tabPanelsSecondary}
          />
        </div>
      ),
    },
  },
  {
    key: 223213,
    title: {
      content: "Some clay-silt lenses",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>Some clay-silt lenses</h2>
          <p>Tab 2 Content</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam
          </p>
        </div>
      ),
    },
  },
  {
    key: 32131232,
    title: {
      content: "New Content 3",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 3</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
    isOpen: false,
  },
  {
    key: 123124,
    title: {
      content: "New Content 4",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 4</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
  {
    key: 123125,
    title: {
      content: "New Content 5",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 5</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
  {
    key: 123126,
    title: {
      content: "New Content 6",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 6</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. ...</p>
        </div>
      ),
    },
  },
  {
    key: 123135,
    title: {
      content: "New Content 14",
      icon: false,
    },
    content: {
      content: (
        <div style={{ padding: "20px" }}>
          <h2>New Content 14</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            animi dicta illum incidunt ipsum nisi quod quos voluptates! Eligendi
            explicabo quos ullam voluptate. Blanditiis consequuntur doloremque
            dolores doloribus ducimus explicabo facere hic illum libero
            molestias nam nobis nostrum perspiciatis quas quos, sapiente
            similique. Aliquid at, ea enim et exercitationem impedit, ipsam
            magni minus numquam odio quae quaerat quod sit veritatis voluptas.
            Architecto eligendi perspiciatis quia rem veniam. Consequatur
            facilis omnis recusandae repellat! Commodi deleniti dolorum ducimus
            et illum incidunt iste nostrum quaerat, reprehenderit voluptatem?
            Consectetur corporis dignissimos dolorum eveniet expedita, harum, id
            impedit ipsam ipsum iste laborum minima nihil officiis omnis
            perspiciatis provident quisquam quos rem, voluptas voluptatem?
            laborum quia similique. Aperiam beatae cupiditate ducimus veniam
            voluptas! Ab alias, aperiam doloremque dolorum enim expedita maiores
            maxime, minus molestias nobis qui, quidem repudiandae sapiente.
          </p>
        </div>
      ),
    },
  },
];

export const MovableAccordionListExample: StoryFn<
  typeof MovableAccordionList
> = () => {
  const [movableListItems, setMovableListItems] = useState<any[]>(movableItems);
  const onMovableListChange = (newItems: any[]) => {
    setMovableListItems(newItems);
  };

  return (
    <div style={wrapper}>
      <MovableAccordionList
        items={movableListItems}
        onMovableListChange={onMovableListChange}
      />
    </div>
  );
};

export const MovableAccordionListInsideTab: StoryFn<
  typeof MovableAccordionList
> = () => {
  const [movableListItems, setMovableListItems] = useState<any[]>(movableItems);
  const onMovableListChange = (newItems: any[]) => {
    setMovableListItems(newItems);
  };
  const panelsPrimary = [
    {
      menuItem: <MenuItem key="properties">Properties</MenuItem>,
      render: () => (
        <TabPane attached={false}>
          <MovableAccordionList
            items={movableListItems}
            onMovableListChange={onMovableListChange}
          />
        </TabPane>
      ),
    },
    {
      menuItem: (
        <MenuItem key="validation" className="tabItemWithIcon">
          Validation
          <Icon name="check circle" />
        </MenuItem>
      ),
      render: () => (
        <TabPane attached={false}>
          <div>
            <h2>Validation Tab Content</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
              animi autem blanditiis cum distinctio doloremque doloribus ducimus
              eius eum facere facilis fuga hic illo impedit laborum minus
              nesciunt omnis, quibusdam quod rerum saepe sunt, vel voluptatem.
              Iste quidem repellat veniam?
            </p>
          </div>
        </TabPane>
      ),
    },
  ];
  return (
    <div style={wrapper}>
      <Tab
        variant="primary"
        menu={{ secondary: true, pointing: true }}
        panes={panelsPrimary}
      />
    </div>
  );
};

export const TabsInsideMovableAccordionList: StoryFn<
  typeof MovableAccordionList
> = () => {
  const [movableListItems, setMovableListItems] =
    useState<any[]>(movableItemsWithTabs);
  const onMovableListChange = (newItems: any[]) => {
    setMovableListItems(newItems);
  };
  const panelsPrimary = [
    {
      menuItem: <MenuItem key="properties">Properties</MenuItem>,
      render: () => (
        <TabPane attached={false}>
          <MovableAccordionList
            items={movableListItems}
            onMovableListChange={onMovableListChange}
            defaultOpenIndexes={[0]}
          />
        </TabPane>
      ),
    },
    {
      menuItem: (
        <MenuItem key="validation" className="tabItemWithIcon">
          Validation
          <Icon name="check circle" />
        </MenuItem>
      ),
      render: () => (
        <TabPane attached={false}>
          <div>
            <h2>Validation Tab Content</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
              animi autem blanditiis cum distinctio doloremque doloribus ducimus
              eius eum facere facilis fuga hic illo impedit laborum minus
              nesciunt omnis, quibusdam quod rerum saepe sunt, vel voluptatem.
              Iste quidem repellat veniam?
            </p>
          </div>
        </TabPane>
      ),
    },
  ];
  return (
    <div style={wrapper}>
      <Tab
        variant="primary"
        menu={{ secondary: true, pointing: true }}
        panes={panelsPrimary}
      />
    </div>
  );
};
