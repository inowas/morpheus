import React from 'react';
import {IVisibility} from '../../types';
import styles from './ControlsModflow3DResults.module.less';

interface IProps {
  colorScaleUrl: string;
  visibilities: IVisibility[];
  onVisibilityChange: (headResults: IVisibility[]) => void;
  visibilityCoordinate: boolean;
  onVisibilityCoordinate: () => void;
  timeSteps: number[];
  selectedTimeStep: number;
  onSelectedTimeStepChange: (timeStep: number) => void;
  zScaling: number;
  onZScalingChange: (zScaling: number) => void;
  colorBarUrl: string;
}

const Controls: React.FC<IProps> = (
  {
    visibilities,
    onVisibilityChange,
    visibilityCoordinate,
    onVisibilityCoordinate,
    timeSteps,
    selectedTimeStep,
    onSelectedTimeStepChange,
    zScaling,
    onZScalingChange,
    colorBarUrl,
  }) => {
  
  return (
    <>
      <h2 className={styles.header}>
        3D model with elevation data
      </h2>
      <div className={styles.mainWrapperLeft}>
        <form className={styles.innerWrapper}>
          <label
            htmlFor="z-scaling"
          >Z Scaling {zScaling}</label>
          <input
            className={styles.inputRange}
            id="z-scaling"
            type="range"
            min={0.1}
            max={100}
            step={0.01}
            value={zScaling}
            onChange={(e) => onZScalingChange(parseFloat(e.target.value))}
          />

        </form>
        <form className={styles.innerWrapper}>
          <div style={{padding: 10}}>
            <input
              id="coordinats"
              type="checkbox"
              checked={visibilityCoordinate}
              onChange={() => {
                onVisibilityCoordinate();
              }}
            />
            <label htmlFor="coordinats">Coordinats</label>
          </div>
        </form>
        <form className={styles.innerWrapper}>
          {visibilities.map((visibility, vIdx) => (
            <div key={vIdx} style={{padding: 10}}>
              <input
                id={`visibility-${vIdx}`}
                type="checkbox"
                checked={visibility.isVisible}
                onChange={() => {
                  const newHeadResults = [...visibilities];
                  newHeadResults[vIdx].isVisible = !newHeadResults[vIdx].isVisible;
                  onVisibilityChange(newHeadResults);
                }}
              />
              <label
                htmlFor={`visibility-${vIdx}`}
              >{visibility.name}</label>
              <input
                className={styles.inputRange}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={visibility.opacity}
                onChange={(e) => {
                  const newHeadResults = [...visibilities];
                  newHeadResults[vIdx].opacity = parseFloat(e.target.value);
                  onVisibilityChange(newHeadResults);
                }}
              />
            </div>
          ))}
        </form>
      </div>
      <div className={styles.mainWrapperRight}>
        <form className={styles.innerWrapper}>
          <label htmlFor="time-step">Time Step</label>
          <select
            style={{display: 'block'}}
            id="time-step"
            value={timeSteps[selectedTimeStep]}
            onChange={(e) => onSelectedTimeStepChange(parseInt(e.target.value, 10))}
          >
            {timeSteps.map((timeStep, index) => (
              <option key={index} value={index}>{timeStep}</option>
            ))}
          </select>
        </form>
        <div className={styles.innerWrapper} style={{opacity: 0.8}}>
          < img src={colorBarUrl}/>
        </div>
      </div>
    </>
  );
};

export default Controls;
