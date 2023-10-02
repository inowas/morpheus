import React, {useEffect, useRef, useState} from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';

import head_image from '../images/example_5_head.png';
import head_json from '../data/example_5_head.json';

const fillNullValuesWithNearest = (data: Array<number | null>[]) => {
  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    for (let colIdx = 0; colIdx < data[rowIdx].length - 1; colIdx++) {
      if (null === data[rowIdx][colIdx] && null !== data[rowIdx][colIdx + 1]) {
        data[rowIdx][colIdx] = data[rowIdx][colIdx + 1];
      }

      if (null !== data[rowIdx][colIdx] && null === data[rowIdx][colIdx + 1]) {
        data[rowIdx][colIdx + 1] = data[rowIdx][colIdx];
      }
    }
  }

  for (let colIdx = 0; colIdx < data[0].length; colIdx++) {
    for (let rowIdx = 0; rowIdx < data.length - 1; rowIdx++) {
      if (null === data[rowIdx][colIdx] && null !== data[rowIdx + 1][colIdx]) {
        data[rowIdx][colIdx] = data[rowIdx + 1][colIdx];
      }

      if (null !== data[rowIdx][colIdx] && null === data[rowIdx + 1][colIdx]) {
        data[rowIdx + 1][colIdx] = data[rowIdx][colIdx];
      }
    }
  }

  let sum = 0;
  let count = 0;
  data.flat().forEach((value: number | null) => {
    if (null !== value) {
      sum += value;
      count++;
    }
  });

  const mean = sum / count;

  return data.map((row: Array<number | null>) => row.map((value: number | null) => {
    if (null === value) {
      return mean;
    }

    return value;
  }));
};

const VtkExample5 = () => {
  const vtkContainerRef = useRef<any>(null);
  const context = useRef<any>(null);

  // State variables to track layer visibility and space between layers
  const [layer1Visible, setLayer1Visible] = useState(true);
  const [layer2Visible, setLayer2Visible] = useState(true);
  const [spaceBetweenLayers, setSpaceBetweenLayers] = useState<number>(-1);

  useEffect(() => {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      container: vtkContainerRef.current,
    });

    // Create and configure texture for layer 1
    const elevationReader1 = vtkElevationReader.newInstance({
      xSpacing: 1,
      ySpacing: 1,
      zScaling: 200,
    });

    // Create and configure elevation reader, texture, and actor for layer 2
    const elevationReader2 = vtkElevationReader.newInstance({
      xSpacing: 0.01568,
      ySpacing: 0.01568,
      zScaling: 200,
    });

    const mapper1 = vtkMapper.newInstance();
    mapper1.setInputConnection(elevationReader1.getOutputPort());

    const actor1 = vtkActor.newInstance();
    actor1.setMapper(mapper1);

    const mapper2 = vtkMapper.newInstance();
    mapper2.setInputConnection(elevationReader2.getOutputPort());

    const actor2 = vtkActor.newInstance();
    actor2.setMapper(mapper2);

    // renderer
    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();


    const img1 = new Image();
    img1.onload = function textureLoaded1() {
      const texture1 = vtkTexture.newInstance();
      texture1.setInterpolate(true);
      texture1.setImage(img1);
      actor1.addTexture(texture1);
      renderWindow.render();
    };
    img1.src = head_image;

    const data = fillNullValuesWithNearest(head_json);
    elevationReader1.parseAsText(data.map((row: any[]) => row.join(',')).join('\n'));
    renderer.resetCamera();
    renderWindow.render();

    renderer.resetCamera();
    renderWindow.render();

    // Add actors for both layers to the renderer
    renderer.addActor(actor1);
    renderer.addActor(actor2);

    // Reset the camera and render the scene
    renderer.resetCamera();
    renderWindow.render();


    context.current = {
      fullScreenRenderer,
      actor1,
      actor2,
      mapper1,
      mapper2,
      img1,
      elevationReader1,
      elevationReader2,
    };

    return () => {
      context.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect for handling visibility changes
  useEffect(() => {
    if (context.current) {
      context.current.actor1.setVisibility(layer1Visible);
      context.current.actor2.setVisibility(layer2Visible);
      context.current.fullScreenRenderer.getRenderWindow().render();
    }
  }, [layer1Visible, layer2Visible]);

  // useEffect for handling spaceBetweenLayers changes
  useEffect(() => {
    // Adjust the position of Layer 2 in the z-axis using spaceBetweenLayers
    context.current.actor2.setPosition(0, 0, spaceBetweenLayers);
    context.current.fullScreenRenderer.getRenderWindow().render();
  }, [spaceBetweenLayers]);


  return (
    <>
      <div
        ref={vtkContainerRef}
        style={{width: '100%', height: '100vh'}}
      />
    </>
  );
};

export default VtkExample5;
