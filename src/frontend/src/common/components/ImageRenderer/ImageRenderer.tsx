import React, {useEffect, useRef, useState} from 'react';

interface IImageRenderer {
  data: number[][];
}

const ImageRenderer = ({data}: IImageRenderer) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const [hoverData, setHoverData] = useState<{ x: number, y: number, value: number } | null>(null);

  useEffect(() => {
    if (null == canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (null == context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!data || 0 === data.length || 0 === data[0].length) return;

    const width = data[0].length;
    const height = data.length;

    const max = Math.max(...data.map(row => Math.max(...row)));
    const min = Math.min(...data.map(row => Math.min(...row)));

    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const color = 255 - (255 * (data[y][x] - min) / (max - min));
        context.fillStyle = `rgb(${color}, ${color}, ${color})`;
        context.fillRect(x, y, 1, 1);
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      if (0 <= x && x < width && 0 <= y && y < height) {
        return setHoverData({x, y, value: data[y][x]});
      }

      return setHoverData(null);
    };

    const handleMouseLeave = () => setHoverData(null);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div style={{position: 'relative', display: 'inline-block', width: '100%'}}>
      <canvas
        ref={canvasRef}
        height={data.length}
        width={data[0].length}
        style={{width: '100%'}}
      />
      {hoverData && (
        <div
          style={{
            position: 'absolute',
            top: hoverData.y,
            left: hoverData.x,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
            pointerEvents: 'none',
            transform: 'translate(10px, -100%)',
          }}
        >
          x: {hoverData.x}, y: {hoverData.y}, value: {hoverData.value}
        </div>
      )}
    </div>
  );
};

export default ImageRenderer;
export type {IImageRenderer};
