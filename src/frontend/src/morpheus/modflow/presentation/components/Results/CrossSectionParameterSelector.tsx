import React, {ReactNode, useEffect} from 'react';
import useDateTimeFormat from 'common/hooks/useDateTimeFormat';
import {Button, DataGrid, Form} from 'common/components';
import ToolTipSlider from 'common/components/Slider/ToolTipSlider';

import {IAvailableResults, ICalculationResult} from '../../../types/Calculation.type';
import {ITimeDiscretization} from '../../../types';
import {Label} from 'semantic-ui-react';


type IFlowResultType = 'head' | 'drawdown';

interface IProps {
  layerNames: string[];
  calculationResult: ICalculationResult;
  onChangeParameters: (layerIdx: number, timeStepIdx: number, type: IFlowResultType) => void;
  isLoading: boolean;
  timeDiscretization: ITimeDiscretization;
}

const CrossSectionParameterSelector = ({calculationResult, layerNames, onChangeParameters, timeDiscretization}: IProps) => {

  const [selectedLayerIdx, setSelectedLayerIdx] = React.useState<number>(calculationResult.flow_head_results.number_of_layers - 1);
  const [selectedTimeStepIdx, setSelectedTimeStepIdx] = React.useState<number>(calculationResult.flow_head_results.times.length - 1);
  const [selectedResults, setSelectedResults] = React.useState<IAvailableResults>(calculationResult.flow_head_results);
  const [selectedResultType, setSelectedResultType] = React.useState<'head' | 'drawdown'>('head');
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const {formatISODate, addDays} = useDateTimeFormat();

  useEffect(() => {
    if ('head' === selectedResultType) {
      setSelectedResults(calculationResult.flow_head_results);
    }

    if ('drawdown' === selectedResultType && calculationResult.flow_drawdown_results) {
      setSelectedResults(calculationResult.flow_drawdown_results);
    }

    onChangeParameters(selectedLayerIdx, selectedTimeStepIdx, selectedResultType);
    // eslint-disable-next-line
  }, [selectedLayerIdx, selectedTimeStepIdx, selectedResultType]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (selectedTimeStepIdx < selectedResults.times.length - 1) {
          setSelectedTimeStepIdx(selectedTimeStepIdx + 1);
        } else {
          setIsPlaying(false);
        }
      }, 500);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [isPlaying, selectedTimeStepIdx]);

  const layerOptions = new Array(selectedResults.number_of_layers).fill(0).map((_, idx) => ({
    key: idx,
    value: idx,
    text: `Layer ${idx + 1} (${layerNames[idx]})`,
  }));

  const getTypeOptions = () => {
    const options = [
      {key: 'head', value: 'head', text: 'Head'},
    ];

    if (calculationResult.flow_drawdown_results) {
      options.push({key: 'drawdown', value: 'drawdown', text: 'Drawdown'});
    }

    return options;
  };

  const handleLayerChange = (value: number) => {
    if (selectedResults.number_of_layers - 1 >= value) {
      setSelectedLayerIdx(value);
    }
  };

  const handleTimeStepChange = (value: number) => {
    if (selectedResults.times.length - 1 >= value) {
      setSelectedTimeStepIdx(value);
    }
  };

  const handleOnPlay = () => {
    if (!isPlaying && selectedTimeStepIdx === selectedResults.times.length - 1) {
      setSelectedTimeStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const getMarks = () => {
    const marks: { [key: number]: ReactNode } = {};
    selectedResults.times.forEach((time, idx) => {
      if (0 === idx % 3 || idx === selectedResults.times.length - 1) {
        marks[time] = <span>{Math.round(time)}</span>;
        return;
      }
    });

    return marks;
  };

  return (
    <DataGrid style={{margin: 10}}>
      <Form.Form>
        <Form.Group>
          {/* Todo @dmytro - add styles to dropdown */}
          <Form.Dropdown
            options={layerOptions}
            value={selectedLayerIdx}
            onChange={(e, {value}) => handleLayerChange(value as number)}
          />
          <Form.Dropdown
            options={getTypeOptions()}
            value={selectedResultType}
            onChange={(e, {value}) => setSelectedResultType(value as 'head' | 'drawdown')}
          />
        </Form.Group>
        <Form.Group>
          <Button
            icon={isPlaying ? 'pause' : 'play'}
            onClick={handleOnPlay}
            disabled={1 >= selectedResults.times.length}
            primary={isPlaying}
            secondary={!isPlaying}
            circular={true}
          />
          <div style={{margin: 'auto', width: 'calc(100% - 80px)'}}>
            {/* Todo @dmytro - add styles and info button */}
            <Label>
              Select time step (days)
            </Label>
            <ToolTipSlider
              min={selectedResults.times[0]}
              max={selectedResults.times[selectedResults.times.length - 1]}
              value={selectedResults.times[selectedTimeStepIdx]}
              marks={getMarks()}
              step={null}
              onChange={(value) => handleTimeStepChange(selectedResults.times.indexOf(value as number))}
              onChangeComplete={(value) => handleTimeStepChange(selectedResults.times.indexOf(value as number))}
              tipFormatter={(value) => `${formatISODate(addDays(timeDiscretization.start_date_time, value))}`}
            />
          </div>
        </Form.Group>

      </Form.Form>
    </DataGrid>
  );
};

export default CrossSectionParameterSelector;
