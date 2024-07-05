import React, {ReactNode, useEffect} from 'react';
import {IAvailableResults} from '../../../types/Calculation.type';
import {DataGrid, Form} from 'common/components';
import ToolTipSlider from '../../../../../common/components/Slider/ToolTipSlider';
import {Button} from 'semantic-ui-react';
import {ITimeDiscretization} from '../../../types';
import useDateTimeFormat from 'common/hooks/useDateTimeFormat';

interface IProps {
  layerNames: string[];
  results: IAvailableResults;
  onFetchFlowResult: (layerIdx: number, timeStepIdx: number) => void;
  isLoading: boolean;
  timeDiscretization: ITimeDiscretization;
}

const CrossSectionParameterSelector = ({results, layerNames, onFetchFlowResult, timeDiscretization}: IProps) => {

  const [selectedLayerIdx, setSelectedLayerIdx] = React.useState<number>(results.number_of_layers - 1);
  const [selectedTimeStepIdx, setSelectedTimeStepIdx] = React.useState<number>(results.times.length - 1);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const {formatISODate, addDays} = useDateTimeFormat();

  useEffect(() => {
    onFetchFlowResult(selectedLayerIdx, selectedTimeStepIdx);
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
        marks[time] = <span style={{whiteSpace: 'nowrap'}}>{formatISODate(addDays(timeDiscretization.start_date_time, time))}</span>;
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
            icon={isPlaying ? 'pause' : 'play'}
            onClick={handleOnPlay}
            style={{width: 50, height: 50}}
            disabled={1 >= results.times.length}
            primary={isPlaying}
            secondary={!isPlaying}
            circular={true}
          />
          <div style={{margin: 15, width: 'calc(100% - 100px)'}}>
            <ToolTipSlider
              min={results.times[0]}
              max={results.times[results.times.length - 1]}
              value={results.times[selectedTimeStepIdx]}
              marks={getMarks()}
              step={null}
              onChange={(value) => handleTimeStepChange(results.times.indexOf(value as number))}
              onChangeComplete={(value) => handleTimeStepChange(results.times.indexOf(value as number))}
              tipFormatter={(value) => `${formatISODate(addDays(timeDiscretization.start_date_time, value))}`}
            />
          </div>
        </Form.Group>

      </Form.Form>
    </DataGrid>
  );
};

export default CrossSectionParameterSelector;
