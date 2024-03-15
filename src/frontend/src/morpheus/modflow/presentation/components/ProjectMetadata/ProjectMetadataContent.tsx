import React from 'react';
import {faArrowRight, faDownload} from '@fortawesome/free-solid-svg-icons';

import {Accordion} from 'semantic-ui-react';
import {Button, DataGrid, DataRow} from 'common/components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styles from './ProjectMetadataContent.module.less';

interface IProps {
  content: any;
}

const ProjectMetadataContent = ({content}: IProps) => {

  const formattedDate = (originalDate: string, withTime: boolean = false) => {
    const date = new Date(originalDate);
    const formattedTime = withTime
      ? ` ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
      : '';

    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}${formattedTime}`;
  };

  const generalPanel = (generalData: any) => {
    return (
      <>
        {generalData.project_name && <div className={styles.contentInner}>
          <span>Model name:</span>
          <strong>{generalData.project_name}</strong>
        </div>}
        {generalData.project_description && <div className={styles.contentInner}>
          <span>Model description:</span>
          <span>{generalData.project_description}</span>
        </div>}
        {generalData.current_version && <div className={styles.contentInner}>
          <span>Actual model version:</span>
          <span>{generalData.current_version}</span>
        </div>}
        {0 < generalData.previous_versions.length && <div className={styles.contentInner}>
          <span>Other versions:</span>
          {/*// TODO can we select other versions? (we can use semantic ui / default select / list  )*/}
          {/*<Select options={data.general.previous_versions.map((previous_version: any, index: number) => (*/}
          {/*  {key: index, value: previous_version, text: previous_version}))}*/}
          {/*/>*/}
          <select defaultValue={'Other versions'}>
            <option
              disabled={true}
              hidden={true}
            >Other versions
            </option>
            <option
              disabled={true}
              value={generalData.current_version}
            >{generalData.current_version}</option>
            {generalData.previous_versions.map((previous_version: any, index: number) => (
              <option
                disabled={true}
                key={index}
                value={previous_version}
              >{previous_version}</option>
            ))}
          </select>
        </div>}
        {0 < generalData.tags.length && <div className={styles.contentInner}>
          <span>Model keywords:</span>
          <div className={styles.tags}>
            <ul className={styles.tagsInner}>
              {generalData.tags.map((tag: any, index: number) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>}
        {generalData.created_at && <div className={styles.contentInner}>
          <span>Created on:</span>
          <span>{formattedDate(generalData.created_at, true)}</span>
        </div>}
        {generalData.last_updated_at && <div className={styles.contentInner}>
          <span>Last modified on:</span>
          <span>{formattedDate(generalData.last_updated_at, true)}</span>
        </div>}
        {/*// TODO what is Title / Should it be a Copy link?*/}
        {generalData.url && <div className={styles.contentInner}>
          <span>Link to model:</span>
          <a href={generalData.url}>Link</a>
        </div>}
      </>
    );
  };
  const permissionPanel = (permissionData: any) => {
    return (
      <>
        {/*// TODO what should we do with "visibility": "public"?*/}
        {0 < permissionData.members.length && <div className={styles.contentInner}>
          <span>Members:</span>
          <ul className={styles.list}>
            {permissionData.members.map((member: any, index: number) => (
              <li key={index}>{member.name} {member.role && <span>{member.role}</span>}</li>
            ))}
          </ul>
        </div>}
        {/*// TODO what should we do with "groups"?*/}
        {0 < permissionData.groups.length && <div className={styles.contentInner}>
          <span>Members:</span>
          <ul className={styles.list}>
            {permissionData.groups.map((group: any, index: number) => (
              <li key={index}>{group.name} {group.role && <span>{group.role}</span>}</li>
            ))}
          </ul>
        </div>}
      </>
    );
  };
  const specialDiscrPanel = (specialDiscrData: any) => {
    return (
      <>
        {specialDiscrData.length_unit && <div className={styles.contentInner}>
          <span>Length unit:</span>
          <span>{specialDiscrData.length_unit}</span>
        </div>}
        {specialDiscrData.crs && <div className={styles.contentInner}>
          <span>Coordinates system:</span>
          <strong>{specialDiscrData.crs}</strong>
        </div>}
        {specialDiscrData.area_unit && specialDiscrData.area && <div className={styles.contentInner}>
          <span>Total model domain area:</span>
          <span>{specialDiscrData.area}{'square_meters' === specialDiscrData.area_unit ? ' sq.meters' : ' meters'}</span>
        </div>}
        {/*// TODO is it allways 4 coordinates? Can we use a table? */}
        {0 < specialDiscrData.bounding_box.length && <div className={styles.contentInner}>
          <span>Coordinates of bounding box:</span>
          <div className={styles.coordinates}>
            {0 < specialDiscrData.bounding_box.length && (
              <table>
                <tbody>
                  {specialDiscrData.bounding_box.reduce((rows: number[][], value: number, index: number) => {
                    if (0 === index % 2) {
                      rows.push([value]);
                    } else {
                      rows[rows.length - 1].push(value);
                    }
                    return rows;
                  }, []).map((row: number[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>}
        {/*// TODO how should it look like?*/}
        {specialDiscrData.grid_size && <div className={styles.contentInner}>
          <span>Grid size (no. of rows x columns):</span>
          <ul>
            {Object.entries(specialDiscrData.grid_size).map(([key, size]: [string, any]) => (
              <li key={key}>
                <strong>{key}:</strong> {size}
              </li>
            ))}
          </ul>
        </div>}
        {/*// TODO how should it look like?*/}
        {specialDiscrData.cell_size && <div className={styles.contentInner}>
          <span>Cell size (cell width x hight):</span>
          <ul>
            {Object.entries(specialDiscrData.cell_size).map(([key, size]: [string, any]) => (
              <li key={key}>
                <strong>{key}:</strong> {size}
              </li>
            ))}
          </ul>
        </div>}
        {specialDiscrData.rotation && <div className={styles.contentInner}>
          <span>Grid rotation angle:</span>
          <span>{specialDiscrData.rotation}</span>
        </div>}
        <div className={styles.contentInner}>
          <span>Grid local refinement:</span>
          <span>{specialDiscrData.grid_local_refinement ? 'YES' : 'NO'}</span>
        </div>
      </>
    );
  };
  const timeDiscrPanel = (timeDiscrData: any) => {
    return (
      <>
        {timeDiscrData.time_unit && <div className={styles.contentInner}>
          <span>Time unit:</span>
          <span>{timeDiscrData.time_unit}</span>
        </div>}
        {timeDiscrData.start_time && <div className={styles.contentInner}>
          <span>Start date:</span>
          <span>{formattedDate(timeDiscrData.start_time)}</span>
        </div>}
        {timeDiscrData.end_time && <div className={styles.contentInner}>
          <span>End date:</span>
          <span>{formattedDate(timeDiscrData.end_time)}</span>
        </div>}
        {timeDiscrData.duration && <div className={styles.contentInner}>
          <span>Total duration:</span>
          <span>{timeDiscrData.duration}</span>
        </div>}
        {timeDiscrData.number_ot_stress_periods && <div className={styles.contentInner}>
          <span>Number of stress periods:</span>
          <span>{timeDiscrData.number_ot_stress_periods}</span>
        </div>}
      </>
    );
  };
  const soilModelPanel = (soilModelData: any) => {
    return (
      <>
        {0 < soilModelData.layers.length && <div className={styles.contentInner}>
          <span>Number of layers:</span>
          <span>{soilModelData.layers.length} {1 < soilModelData.layers.length ? ' layers' : ' layers'}</span>
        </div>}
        {soilModelData.layers.map((layer: any, index: number) => {
          return (
            <div className={styles.contentInner} key={layer.name}>
              <span>Layer {index + 1}:</span>
              <div className={styles.multiplyColumn}>
                <span>{layer.name}</span>
                <Button
                  className={styles.downloadButton}
                  as="a"
                  href={layer.download_url}
                  target="_blank"
                  download={true}
                  {...(null as any)}
                >
                  <FontAwesomeIcon icon={faDownload}/>
                </Button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const panels: any[] = [];
  for (let key in content) {
    switch (key) {
    case 'general': {
      panels.push({
        key: 1,
        title: {
          content: 'General information',
          icon: <FontAwesomeIcon icon={faArrowRight} className={'redIcon'}/>,
        },
        content: {
          content: (
            generalPanel(content[key])
          ),
        },
      });
      break;
    }
    case 'permissions': {
      panels.push({
        key: 'permissions',
        title: {
          content: 'Permission rules',
          icon: <FontAwesomeIcon icon={faArrowRight} className={'redIcon'}/>,
        },
        content: {
          content: (
            permissionPanel(content[key])
          ),
        },
      });
      break;
    }
    case 'spatial_discretization': {
      panels.push({
        key: 'spatial_discretization',
        title: {
          content: 'Model geometry',
          icon: <FontAwesomeIcon icon={faArrowRight} className={'redIcon'}/>,
        },
        content: {
          content: (
            specialDiscrPanel(content[key])
          ),
        },
      });
      break;
    }
    case 'time_discretization': {
      panels.push({
        key: 1,
        title: {
          content: 'Time discretization',
          icon: <FontAwesomeIcon icon={faArrowRight} className={'redIcon'}/>,
        },
        content: {
          content: (
            timeDiscrPanel(content[key])
          ),
        },
      });
      break;
    }
    case 'soil_model': {
      panels.push({
        key: 1,
        title: {
          content: 'Model layers',
          icon: <FontAwesomeIcon icon={faArrowRight} className={'redIcon'}/>,
        },
        content: {
          content: (
            soilModelPanel(content[key])
          ),
        },
      });
      break;
    }
    }
  }

  const defaultActiveIndex = Array.from({length: panels.length}, (_, index) => index);

  return (
    <DataGrid>
      <DataRow title={'Model metadata'}/>
      <Accordion
        defaultActiveIndex={defaultActiveIndex}
        panels={panels}
        exclusive={false}
      />
    </DataGrid>
  );
};

export default ProjectMetadataContent;
