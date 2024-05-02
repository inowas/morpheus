import React, {useEffect, useRef} from 'react';

interface IImageRenderer {
  data: number[][];
}

const ImageRenderer = ({data}: IImageRenderer) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    if (null == canvasRef.current)
      return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (null == context)
      return;

    const max = Math.max(...data.map(row => Math.max(...row)));
    const min = Math.min(...data.map(row => Math.min(...row)));

    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const color = 255 - (255 * (data[y][x] - min) / (max - min));
        context.fillStyle = `rgb(${color}, ${color}, ${color})`;
        context.fillRect(x, y, 1, 1);
      }
    }

  }, [data]);


  return (
    <div>
      <canvas
        ref={canvasRef}
        height={data.length}
        width={data[0].length}
        style={{width: '100%'}}
      />
    </div>
  );
};

export default ImageRenderer;
export type {IImageRenderer};
