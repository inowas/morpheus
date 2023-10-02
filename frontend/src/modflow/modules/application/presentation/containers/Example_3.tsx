import React, {useEffect, useRef, useState} from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';

import demImage1 from '../images/dem.jpg';
import demImage2 from '../images/dem2.jpg';
import demData1 from '../data/dem.csv';
import demData2 from '../data/dem2.csv';
import ControlsE2 from '../components/ControlsE3';

const VtkExample3 = () => {
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
      xSpacing: 0.01568,
      ySpacing: 0.01568,
      zScaling: 0.1,
    });

    // Create and configure elevation reader, texture, and actor for layer 2
    const elevationReader2 = vtkElevationReader.newInstance({
      xSpacing: 0.01568,
      ySpacing: 0.01568,
      zScaling: 0.1,
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
    img1.src = demImage1;

    elevationReader1.parseAsText(demData1.map((row: []) => row.join(',')).join('\n'));
    renderer.resetCamera();
    renderWindow.render();

    const img2 = new Image();
    img2.onload = function textureLoaded2() {
      const texture2 = vtkTexture.newInstance();
      texture2.setInterpolate(true);
      texture2.setImage(img2);
      actor2.addTexture(texture2);
      // Adjust the position of Layer 2 in the z-axis using spaceBetweenLayers
      actor2.setPosition(0, 0, spaceBetweenLayers);
      renderWindow.render();
    };

    img2.src = demImage2;
    elevationReader2.parseAsText(demData2.map((row: []) => row.join(',')).join('\n'));
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
      img2,
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
      <ControlsE2
        layer1Visible={layer1Visible}
        layer2Visible={layer2Visible}
        spaceBetweenLayers={spaceBetweenLayers}
        onLayer1VisibleChange={setLayer1Visible}
        onLayer2VisibleChange={setLayer2Visible}
        onSpaceBetweenLayersChange={setSpaceBetweenLayers}
      />

      <div
        ref={vtkContainerRef}
        style={{width: '100%', height: '100vh'}}
      />
    </>
  );
};

export default VtkExample3;
