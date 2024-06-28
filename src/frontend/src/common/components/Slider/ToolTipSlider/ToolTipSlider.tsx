import React, {LegacyRef, ReactElement, ReactNode, useEffect, useRef} from 'react';
import type {SliderProps} from 'rc-slider';
import Slider from 'rc-slider';
import Tooltip, {TooltipRef} from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import raf from 'rc-util/lib/raf';

interface HandleTooltipProps {
  value: number;
  children: ReactElement;
  visible: boolean;
  tipFormatter?: (value: number) => ReactNode;
}

const HandleTooltip: React.FC<HandleTooltipProps> = (props) => {
  const {value, children, visible, tipFormatter = (val) => `${val} %`, ...restProps} = props;

  const tooltipRef = useRef<TooltipRef>();
  const rafRef = useRef<number | null>(null);

  const cancelKeepAlign = () => {
    raf.cancel(rafRef.current!);
  };

  function keepAlign() {
    if (!tooltipRef) {
      return;
    }

    rafRef.current = raf(() => {
      tooltipRef.current?.forceAlign();
    });
  }

  useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{minHeight: 'auto'}}
      ref={tooltipRef as LegacyRef<TooltipRef>}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

export const handleRender: SliderProps['handleRender'] = (node, props) => (
  <HandleTooltip value={props.value} visible={props.dragging}>
    {node}
  </HandleTooltip>
);

interface TooltipSliderProps extends SliderProps {
  tipFormatter?: (value: number) => ReactNode;
  tipProps?: any;
}

const TooltipSlider: React.FC<TooltipSliderProps> = ({tipFormatter, tipProps, ...props}) => {
  const tipHandleRender: SliderProps['handleRender'] = (node, handleProps) => (
    <HandleTooltip
      value={handleProps.value}
      visible={handleProps.dragging}
      tipFormatter={tipFormatter}
      {...tipProps}
    >
      {node}
    </HandleTooltip>
  );

  return <Slider {...props} handleRender={tipHandleRender}/>;
};

export default TooltipSlider;
