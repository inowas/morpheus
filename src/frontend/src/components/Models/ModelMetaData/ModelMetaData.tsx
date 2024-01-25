import React, {useState} from 'react';
import {DataGrid, DataRow} from '../index';
// import {Button} from 'components';
import styles from './ModelMetaData.module.less';
import {Accordion, AccordionContent, AccordionTitle} from 'semantic-ui-react';
import jsonData from '../ProjectOverview.json';
import {AccordionItem, AccordionRef} from 'components/Accordion/Accordion';


const ModelMetaData: React.FC = () => {
  const [data, setData] = useState(jsonData);

  const formattedDate = (originalDate: string) => {
    const date = new Date(originalDate);
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const generalPanel = (generalData: any) => {
    return (
      <div className={styles.content}>
        <div className={styles.dataRow}>
          <span>Model name:</span>
          <span>{generalData.project_name}</span>
        </div>
        <div className={styles.dataRow}>
          <span>Model description:</span>
          <span>{generalData.project_description}</span>
        </div>
        <div className={styles.dataRow}>
          <span>Actual model version:</span>
          <span>{generalData.current_version}</span>
        </div>
        <div className={styles.dataRow}>
          <span>Other versions:</span>
          <select name="tags">
            {generalData.previous_versions.map((previous_version: any, index: number) => (
              <option key={index} value={previous_version}>{previous_version}</option>
            ))}
          </select>
        </div>
        <div className={styles.dataRow}>
          <span>Model keywords:</span>
          <select name="tags">
            {generalData.tags.map((tag: any, index: number) => (
              <option key={index} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className={styles.dataRow}>
          <span>Created on:</span>
          <span>{formattedDate(generalData.created_at)}</span>
        </div>
        <div className={styles.dataRow}>
          <span>Last modified on:</span>
          <span>{formattedDate(generalData.last_updated_at)}</span>
        </div>
        <div className={styles.dataRow}>
          <span>Link:</span>
          <span>{generalData.url}</span>
        </div>
      </div>
    );
  };


  // TODO ======VERSION PANEL 2==========================================================
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const handleItemClick = (index: number) => {
    const currentIndex = activeIndices.indexOf(index);
    if (-1 === currentIndex) {
      setActiveIndices([...activeIndices, index]);
    } else {
      const newIndices = [...activeIndices];
      newIndices.splice(currentIndex, 1);
      setActiveIndices(newIndices);
    }
  };
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // const handleItemClick = (index: number) => {
  //   setActiveIndex(index === activeIndex ? null : index);
  // };
  // TODO ======VERSION PANEL 2==========================================================


  // TODO ======VERSION PANEL 3==========================================================
  const panels: any[] = [];
  for (let key in data) {
    switch (key) {
    case 'general': {
      panels.push({
        key: 1,
        title: {
          content: 'General information',
          icon: false,
        },
        content: {
          content: (
            generalPanel(data[key])
          ),
        },
      });
      break;
    }
    case 'permissions': {
      panels.push({
        key: 'care-for-dogs',
        title: {
          content: 'How do I care for a dog?',
          icon: false,
        },
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium, ad aliquam consectetur corporis error id ipsa laboriosam laborum maiores modi molestias nesciunt, nobis numquam officiis ratione tempore vero! Officia!',
      });
      break;
    }
    }
  }
  // TODO ======VERSION PANEL 3==========================================================


  return (
    <div className={styles.fullHeight}>
      <DataGrid>
        <DataRow title={'ERSION PANEL 1'}/>
        <AccordionRef exclusive={false}>


          <AccordionItem title="General information">
            {generalPanel(data.general)}
          </AccordionItem>


          <AccordionItem title="Some title 2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dignissimos dolore dolorem eos est ipsam modi nemo odit praesentium vel. Aut itaque nesciunt nobis
            nostrum obcaecati possimus praesentium repellendus unde.
          </AccordionItem>
        </AccordionRef>

        <DataRow title={'ERSION PANEL 2'}/>
        <Accordion>
          <AccordionTitle
            active={activeIndices.includes(0)}
            index={0}
            onClick={() => handleItemClick(0)}
          >
            General information
          </AccordionTitle>
          <AccordionContent active={activeIndices.includes(0)}>
            {generalPanel(data.general)}
          </AccordionContent>

          <AccordionTitle
            active={activeIndices.includes(1)}
            index={1}
            onClick={() => handleItemClick(1)}
          >
            General information
          </AccordionTitle>
          <AccordionContent active={activeIndices.includes(1)}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dignissimos dolore dolorem eos est ipsam modi nemo odit praesentium vel. Aut itaque nesciunt nobis
            nostrum obcaecati possimus praesentium repellendus unde.
          </AccordionContent>
        </Accordion>

        <DataRow title={'ERSION PANEL 3'}/>
        <Accordion
          // defaultActiveIndex={[0]}
          panels={panels}
          exclusive={false}
        />
      </DataGrid>
    </div>
  );
};

export default ModelMetaData;
