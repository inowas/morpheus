import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCalculation} from '../../application';

const SubmitCalculationIdContainer = () => {

  const [calculationId, setCalculationId] = useState<string>('');
  const navigateTo = useNavigate();

  const {updateCalculationId, calculation, error, loading} = useCalculation();


  const handleSubmit = async () => {
    await updateCalculationId(calculationId);
  };

  useEffect(() => {
    if (calculation) {
      navigateTo(`/${calculationId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculation]);

  return (
    <div style={{
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 400,
        }}
      >
        <h1>Enter your Calculation ID here</h1>
        {error && <div style={{color: 'red'}}>{error.message}</div>}
        <input
          type="text"
          placeholder=""
          value={calculationId}
          onChange={(e) => setCalculationId(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !calculationId}
        >Submit</button>
      </div>
    </div>
  );
};

export default SubmitCalculationIdContainer;
