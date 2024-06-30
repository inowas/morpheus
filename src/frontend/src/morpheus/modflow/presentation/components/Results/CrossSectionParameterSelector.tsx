import React, {ReactNode, useEffect} from 'react';
import {IAvailableResults} from '../../../types/Calculation.type';
import {DataGrid, Form} from 'common/components';
import SimpleSlider from 'common/components/Slider/SimpleSlider';
import ToolTipSlider from '../../../../../common/components/Slider/ToolTipSlider';
import {Button} from 'semantic-ui-react';

interface IProps {
  layerNames: string[];
  results: IAvailableResults;
  onFetchFlowResult: (layerIdx: number, timeStepIdx: number) => void;
  isLoading: boolean;
}

const CrossSectionParameterSelector = ({results, layerNames, onFetchFlowResult}: IProps) => {

  const [selectedLayerIdx, setSelectedLayerIdx] = React.useState<number>(results.number_of_layers - 1);
  const [selectedTimeStepIdx, setSelectedTimeStepIdx] = React.useState<number>(results.times.length - 1);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  useEffect(() => {
    onFetchFlowResult(selectedLayerIdx, selectedTimeStepIdx);
  }, [selectedLayerIdx, selectedTimeStepIdx]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (selectedTimeStepIdx < results.times.length - 1) {
          setSelectedTimeStepIdx(selectedTimeStepIdx + 1);
        } else {
          setIsPlaying(false);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, selectedTimeStepIdx]);

  const layerOptions = new Array(results.number_of_layers).fill(0).map((_, idx) => ({
    key: idx,
    value: idx,
    text: `Layer ${idx + 1} (${layerNames[idx]})`,
  }));

  const handleLayerChange = (value: number) => {
    if (results.number_of_layers - 1 >= value) {
      setSelectedLayerIdx(value);
    }
  };

  const handleTimeStepChange = (value: number) => {
    if (results.times.length - 1 >= value) {
      setSelectedTimeStepIdx(value);
    }
  };

  const handleOnPlay = () => {
    if (!isPlaying && selectedTimeStepIdx === results.times.length - 1) {
      setSelectedTimeStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const getMarks = () => {
    const marks: { [key: number]: ReactNode } = {};
    results.times.forEach((time, idx) => {
      if (0 === idx || idx === results.times.length - 1) {
        marks[time] = <span>{Math.round(time)}</span>;
        return;
      }

      marks[time] = <span></span>;
    });
    return marks;
  };

  return (
    <DataGrid>
      <Form.Form>
        <Form.Dropdown
          options={layerOptions}
          value={selectedLayerIdx}
          onChange={(e, {value}) => handleLayerChange(value as number)}
        />
        <Form.Group>
          <Button
            icon={isPlaying ? 'pause' : 'play'} onClick={handleOnPlay}
            style={{marginLeft: 10}} disabled={1 >= results.times.length}
          />
          <div style={{margin: 20, width: '100%'}}>
            <ToolTipSlider
              min={results.times[0]}
              max={results.times[results.times.length - 1]}
              value={results.times[selectedTimeStepIdx]}
              marks={getMarks()}
              step={null}
              onChange={(value) => handleTimeStepChange(results.times.indexOf(value as number))}
              onChangeComplete={(value) => handleTimeStepChange(results.times.indexOf(value as number))}
              tipFormatter={(value) => `${Math.round(value)} days`}
            />
          </div>
        </Form.Group>

      </Form.Form>
    </DataGrid>
  );
};

export default CrossSectionParameterSelector;
