import React from 'react';

interface IProps {
  layer1Visible: boolean;
  layer2Visible: boolean;
  spaceBetweenLayers: number;
  onLayer1VisibleChange: (visible: boolean) => void;
  onLayer2VisibleChange: (visible: boolean) => void;
  onSpaceBetweenLayersChange: (space: number) => void;
}

const ControlsE2: React.FC<IProps> = ({
  layer1Visible,
  layer2Visible,
  spaceBetweenLayers,
  onLayer1VisibleChange,
  onLayer2VisibleChange,
  onSpaceBetweenLayersChange,
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

      {/*<div*/}
      {/*    style={{*/}
      {/*        position: 'absolute',*/}
      {/*        bottom: '10px',*/}
      {/*        left: '10px',*/}
      {/*        zIndex: 2,*/}
      {/*        background: 'white',*/}
      {/*        padding: '8px',*/}
      {/*    }}*/}
      {/*>*/}
      {/*    <h3>Keyboard Controls:</h3>*/}
      {/*    <p>Arrow keys: Rotate the scene.</p>*/}
      {/*    <p>W and S keys: Move the camera forward and backward.</p>*/}
      {/*    <p>A and D keys: Strafe the camera left and right.</p>*/}
      {/*    <p>Q and E keys: Roll the camera.</p>*/}
      {/*    <p>R key: Reset the camera to the initial view.</p>*/}
      {/*</div>*/}

    </>
  );
};

export default ControlsE2;
