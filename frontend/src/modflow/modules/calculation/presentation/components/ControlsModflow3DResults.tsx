import React from 'react';
import {IVisibility} from '../../types';

interface IProps {
  colorScaleUrl: string;
  visibilities: IVisibility[];
  onVisibilityChange: (headResults: IVisibility[]) => void;
  timeSteps: number[];
  selectedTimeStep: number;
  onSelectedTimeStepChange: (timeStep: number) => void;
  zScaling: number;
  onZScalingChange: (zScaling: number) => void;
  colorBarUrl: string;
}

const Controls: React.FC<IProps> = ({
  visibilities,
  onVisibilityChange,
  timeSteps,
  selectedTimeStep,
  onSelectedTimeStepChange,
  zScaling,
  onZScalingChange,
  colorBarUrl,
}) => (
  <>
    <h2
      style={{
        position: 'absolute',
        textAlign: 'center',
        zIndex: 1000,
        color: 'red',
        width: '100%',
      }}
    >
      3D model with elevation data
    </h2>
    <div
      style={{
        position: 'absolute',
        top: '30px',
        left: '30px',
        background: 'white',
        padding: '12px',
        borderRadius: '4px',
      }}
    >
      <form>
        <section style={{padding: 10, borderBottom: '2px dotted #ccc'}}>
          <label htmlFor="z-scaling">Z Scaling {zScaling}</label>
          <input
            style={{display: 'block'}}
            id="z-scaling"
            type="range"
            min={0.1}
            max={100}
            step={0.01}
            value={zScaling}
            onChange={(e) => onZScalingChange(parseFloat(e.target.value))}
          />
        </section>
        {visibilities.map((visibility, vIdx) => (
          <div key={vIdx}>
            <section style={{padding: 10}}>
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
                style={{paddingLeft: 15, fontSize: '1.2em'}}
              >{visibility.name}</label>
              <input
                style={{display: 'block', marginTop: 10}}
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
            </section>
          </div>
        ))}
      </form>
    </div>

    <div
      style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
      }}
    >
      <form
        style={{
          background: 'white',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: 10,
        }}
      >
        <section style={{margin: 10}}>
          <label htmlFor="time-step">Time Step</label>
          <select
            style={{display: 'block'}}
            id="time-step"
            value={selectedTimeStep}
            onChange={(e) => onSelectedTimeStepChange(parseInt(e.target.value, 10))}
          >
            {timeSteps.map((timeStep, index) => (
              <option key={index} value={index}>{timeStep}</option>
            ))}
          </select>
        </section>
      </form>
      <div
        style={{
          background: 'white',
          padding: '12px',
          borderRadius: '4px',
          opacity: 0.8,
        }}
      >
        < img
          src={colorBarUrl}
        />
      </div>
    </div>
  </>
);

export default Controls;
