import React from 'react';

interface IProps {
  layer1Visible: boolean;
  layer2Visible: boolean;
  spaceBetweenLayers: number;
  opacityValue1: number;
  opacityValue2: number;
  layer2Color: string;
  onLayer1VisibleChange: (visible: boolean) => void;
  onLayer2VisibleChange: (visible: boolean) => void;
  onSpaceBetweenLayersChange: (space: number) => void;
  onOpacityValue1Change: (opacity: number) => void;
  onOpacityValue2Change: (opacity: number) => void;
  onLayer2ColorChange: (color: string) => void;
}

const ControlsE4: React.FC<IProps> = ({
  layer1Visible,
  layer2Visible,
  spaceBetweenLayers,
  opacityValue1,
  opacityValue2,
  layer2Color,
  onLayer1VisibleChange,
  onLayer2VisibleChange,
  onSpaceBetweenLayersChange,
  onOpacityValue1Change,
  onOpacityValue2Change,
  onLayer2ColorChange,
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
            <label htmlFor="opacityValue1" style={{display: 'block'}}>Layer 1 Opacity</label>
            <input
              id="opacityValue1"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacityValue1}
              style={{display: 'block'}}
              onChange={(ev) => onOpacityValue1Change(Number(ev.target.value))}
            />
          </section>

          <section style={{margin: 10}}>
            <label htmlFor="opacityValue2" style={{display: 'block'}}>Layer 1 Opacity</label>
            <input
              id="opacityValue2"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacityValue2}
              style={{display: 'block'}}
              onChange={(ev) => onOpacityValue2Change(Number(ev.target.value))}
            />
          </section>

          <section style={{margin: 10}}>
            <label htmlFor="colorValue2" style={{display: 'block'}}>Layer 2 Color</label>
            <input
              id="colorValue2"
              type="color"
              value={layer2Color}
              style={{display: 'block'}}
              onChange={(ev) => onLayer2ColorChange(ev.target.value)}
            />
          </section>

          <section style={{margin: 10}}>
            <label htmlFor="layer_1" style={{paddingRight:10}}>Layer 1</label>
            <input
              id="layer_1"
              type="checkbox"
              checked={layer1Visible}
              onChange={() => onLayer1VisibleChange(!layer1Visible)}
            />
          </section>

          <section style={{margin: 10}}>
            <label htmlFor="layer_2" style={{paddingRight:10}}>Layer 2</label>
            <input
              id="layer_2"
              type="checkbox"
              checked={layer2Visible}
              onChange={() => onLayer2VisibleChange(!layer2Visible)}
            />
          </section>

          <section style={{margin: 10}}>
            <label htmlFor="spaceBetweenLayers" style={{display: 'block'}}>Space Between Layers</label>
            <input
              id="spaceBetweenLayers"
              type="range"
              min="-5"
              max="0"
              step="0.5"
              value={spaceBetweenLayers}
              style={{display: 'block'}}
              onChange={(ev) => onSpaceBetweenLayersChange(Number(ev.target.value))}
            />
          </section>
        </form>
      </div>
    </>
  );
};

export default ControlsE4;
