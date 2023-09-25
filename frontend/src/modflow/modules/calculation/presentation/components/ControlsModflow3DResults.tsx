import React from 'react';

interface IProps {
  topElevationVisible: boolean;
  onTopElevationVisibleChange: (visible: boolean) => void;
  topElevationOpacity: number;
  onTopElevationOpacityChange: (opacity: number) => void;
}

const Controls: React.FC<IProps> = (
  {
    topElevationVisible,
    onTopElevationVisibleChange,
    topElevationOpacity,
    onTopElevationOpacityChange,
  }) => {

  return (
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
          <section style={{margin: 10}}>
            <label htmlFor="top-elevation-visibility" style={{paddingRight: 10}}>Top Elevation</label>
            <input
              id="top-elevation-visibility"
              type="checkbox"
              checked={topElevationVisible}
              onChange={() => onTopElevationVisibleChange(!topElevationVisible)}
            />
          </section>
          <section style={{margin: 10}}>
            <label htmlFor="top-elevation-opacity" style={{display: 'block'}}>Top Elevation Opacity</label>
            <input
              id="top-elevation-opacity"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={topElevationOpacity}
              onChange={(e) => onTopElevationOpacityChange(parseFloat(e.target.value))}
            />
          </section>
        </form>
      </div>
    </>
  );
};

export default Controls;
