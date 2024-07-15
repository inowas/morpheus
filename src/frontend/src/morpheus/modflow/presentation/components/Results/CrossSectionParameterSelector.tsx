import React, {ReactNode, useEffect} from 'react';
import {Button, DataGrid, Form} from 'common/components';
import ToolTipSlider from 'common/components/Slider/ToolTipSlider';

import {Label} from 'semantic-ui-react';


type IResultType = 'head' | 'drawdown' | 'concentration';

interface IProps {
  isLoading: boolean;
  availableLayers: string[];
  selectedLayer: number;
  onChangeSelectedLayer: (layer: number) => void;
  availableResultTypes: IResultType[];
  selectedResultType: IResultType;
  onChangeResultType: (type: IResultType) => void;
  availableTotalTimes: number[];
  selectedTimeIdx: number;
  onChangeTimeIdx: (timeStepIdx: number) => void;
  formatTotalTime: (time: number) => string;
}

const CrossSectionParameterSelector = ({
  availableLayers,
  selectedLayer,
  onChangeSelectedLayer,
  availableResultTypes,
  selectedResultType,
  onChangeResultType,
  availableTotalTimes,
  selectedTimeIdx,
  onChangeTimeIdx,
  formatTotalTime,
}: IProps) => {

  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [availableTotalTimes]);


  useEffect(() => {
    if (isPlaying && availableTotalTimes) {
      const interval = setInterval(() => {
        if (selectedTimeIdx < availableTotalTimes.length - 1) {
          onChangeTimeIdx(selectedTimeIdx + 1);
          return;
        }
        setIsPlaying(false);
      }, 500);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
    }, [isPlaying, selectedTimeIdx]);

  const getLayerOptions = () => availableLayers.map((name, idx) => ({
    key: idx,
    value: idx,
    text: `Layer ${idx + 1} (${name})`,
  }));

  const getResultTypeOptions = () => availableResultTypes.map((type) => ({
    key: type,
    value: type,
    text: type.charAt(0).toUpperCase() + type.slice(1),
  }));


  const handleOnPlay = () => {
    if (!isPlaying && selectedTimeIdx === availableTotalTimes.length - 1) {
      onChangeTimeIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const getMarks = () => {
    const marks: { [key: number]: ReactNode } = {};
    const numberOfResults = availableTotalTimes.length;
    const modulo = Math.ceil(numberOfResults / 16);
    availableTotalTimes.forEach((time, idx) => {
      if (0 === idx % modulo || idx === availableTotalTimes.length - 1) {
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
            options={getLayerOptions()}
            value={selectedLayer}
            onChange={(e, {value}) => onChangeSelectedLayer(value as number)}
          />
          <Form.Dropdown
            options={getResultTypeOptions()}
            value={selectedResultType}
            onChange={(e, {value}) => onChangeResultType(value as IResultType)}
          />
        </Form.Group>
        <Form.Group>
          <Button
            icon={isPlaying ? 'pause' : 'play'}
            onClick={handleOnPlay}
            disabled={1 >= availableTotalTimes.length}
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
              min={availableTotalTimes[0]}
              max={availableTotalTimes[availableTotalTimes.length - 1]}
              value={availableTotalTimes[selectedTimeIdx]}
              marks={getMarks()}
              step={null}
              onChange={(value) => onChangeTimeIdx(availableTotalTimes.indexOf(value as number))}
              onChangeComplete={(value) => onChangeTimeIdx(availableTotalTimes.indexOf(value as number))}
              tipFormatter={(value) => formatTotalTime(value as number)}
            />
          </div>
        </Form.Group>

      </Form.Form>
    </DataGrid>
  );
};

export default CrossSectionParameterSelector;
