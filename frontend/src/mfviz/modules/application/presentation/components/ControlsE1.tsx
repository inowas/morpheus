import React from 'react';

interface IProps {
  coneResolution: number;
  representation: number;
  onChangeConeResolution: (value: number) => void;
  onChangeRepresentation: (value: number) => void;
}

const ControlsE1: React.FC<IProps> = ({coneResolution, representation, onChangeConeResolution, onChangeRepresentation}) => {
  return (
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
          <label htmlFor="representation" style={{display: 'block'}}>
            Representation
          </label>
          <select
            id="representation"
            value={representation}
            style={{
              display: 'block',
              width: '100%',
            }}
            onInput={(event) => {
              const target = event.target as HTMLSelectElement;
              const value = target.value;
              onChangeRepresentation(Number(value));
            }}
          >
            <option value="0">Points</option>
            <option value="1">Wireframe</option>
            <option value="2">Surface</option>
          </select>
        </section>

        <section style={{margin: 10}}>
          <label htmlFor="coneResolution" style={{display: 'block'}}>Cone Resolution</label>
          <input
            id="coneResolution"
            type="range"
            min="3"
            max="80"
            value={coneResolution}
            style={{display: 'block'}}
            onChange={(ev) => onChangeConeResolution(Number(ev.target.value))}
          />
        </section>
      </form>
    </div>
  );
};

export default ControlsE1;
