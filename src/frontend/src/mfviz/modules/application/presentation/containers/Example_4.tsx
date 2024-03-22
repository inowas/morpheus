import React, {useEffect, useRef, useState} from 'react';

import ControlsE4 from '../components/ControlsE4';
import demData1 from '../data/dem.csv';
import demData2 from '../data/dem2.csv';
import demImage1 from '../images/dem.jpg';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
// @ts-ignore
import vtkCubeAxesActor from '@kitware/vtk.js/Rendering/Core/CubeAxesActor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';

const hexToRgbFraction = (hex: string) => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b]; // Return an array of [r, g, b]
};

const VtkExample4 = () => {
  const vtkContainerRef = useRef<any>(null);
  const context = useRef<any>(null);

  // State variables to track layer visibility, space between layers, and opacity values
  const [layer1Visible, setLayer1Visible] = useState(true);
  const [layer2Visible, setLayer2Visible] = useState(true);
  const [spaceBetweenLayers, setSpaceBetweenLayers] = useState(-1);
  const [opacityValue1, setOpacityValue1] = useState(1); // Opacity for the first layer
  const [opacityValue2, setOpacityValue2] = useState(0.5); // Opacity for the second layer
  const [layer2Color, setLayer2Color] = useState('#f90101'); // Color for the second layer
  const [axisLabels, setAxisLabels] = useState(['X', 'Y', 'Z']); // Color for the second layer


  const computeUpdatedBounds = (actor1Bounds: number[], actor2Bounds: number[], zTranslation: number) => {
    const updatedZMin = Math.min(zTranslation, actor2Bounds[4]);
    return [
      Math.min(actor1Bounds[0], actor2Bounds[0]), // X min
      Math.max(actor1Bounds[1], actor2Bounds[1]), // X max
      Math.min(actor1Bounds[2], actor2Bounds[2]), // Y min
      Math.max(actor1Bounds[3], actor2Bounds[3]), // Y max
      updatedZMin, // Z min (updated based on spaceBetweenLayers)
      Math.max(actor1Bounds[5], actor2Bounds[5]), // Z max
    ];
  };

  useEffect(() => {
    // ----------------------------------------------------------------------------
    // Standard rendering code setup
    // ----------------------------------------------------------------------------
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      container: vtkContainerRef.current,
    });

    // ----------------------------------------------------------------------------
    // Simple pipeline  Mapper --> Actor
    // ----------------------------------------------------------------------------
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
    // Adjust the position of Layer 2 in the z-axis using spaceBetweenLayers
    actor2.setPosition(0, 0, spaceBetweenLayers);

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

    // ----------------------------------------------------------------------------
    // Create default camera - starting point...
    // ----------------------------------------------------------------------------
    const camera = renderer.getActiveCamera();
    const defaultFocalPoint: [number, number, number] = [1, 0, 0];
    const defaultPosition: [number, number, number] = [-1, 2, 1];
    const defaultViewUp: [number, number, number] = [0, 0, 1];
    camera.setFocalPoint(...defaultFocalPoint);
    camera.setPosition(...defaultPosition);
    camera.setViewUp(...defaultViewUp);

    elevationReader1.parseAsText(demData1.map((row: []) => row.join(',')).join('\n'));
    elevationReader2.parseAsText(demData2.map((row: []) => row.join(',')).join('\n'));

    renderer.resetCamera();
    renderWindow.render();


    fullScreenRenderer.getInteractor().onAnimation(() => {
      camera.setViewUp(...defaultViewUp);
    });

    // ----------------------------------------------------------------------------
    // Add the actor to the renderer and set the camera
    // ----------------------------------------------------------------------------
    // Add actors for both layers to the renderer
    renderer.addActor(actor1);
    renderer.addActor(actor2);

    // Reset the camera and render the scene
    renderer.resetCamera();
    renderWindow.render();

    // ----------------------------------------------------------------------------
    // Create an XYZ coordinate system actor
    // ----------------------------------------------------------------------------
    const cubeAxes = vtkCubeAxesActor.newInstance();
    // Set custom labels for the axes
    cubeAxes.setAxisLabelsFrom(axisLabels);
    cubeAxes.setCamera(renderer.getActiveCamera());
    renderer.addActor(cubeAxes);

    context.current = {
      fullScreenRenderer,
      actor1,
      actor2,
      cubeAxes,
      mapper1,
      mapper2,
      img1,
      elevationReader1,
      elevationReader2,
    };

    return () => {
      context.current = null;
    };
    // eslint-disable-next-line
  }, []); // No dependencies, only runs once

  // useEffect for handling visibility changes
  useEffect(() => {
    if (context.current) {
      context.current.actor1.setVisibility(layer1Visible);
      context.current.actor2.setVisibility(layer2Visible);
      context.current.fullScreenRenderer.getRenderWindow().render();
    }
  }, [layer1Visible, layer2Visible]);

  // useEffect for handling spaceBetweenLayers changes + Update cubeAxes position
  useEffect(() => {
    if (context.current) {
      // Update cubeAxes position and data bounds
      const updatedCombinedBounds = computeUpdatedBounds(
        context.current.actor1.getBounds(),
        context.current.actor2.getBounds(),
        spaceBetweenLayers,
      );

      // Remove the existing cube axes actor
      context.current.fullScreenRenderer.getRenderer().removeActor(context.current.cubeAxes);
      // Create a new cube axes actor with updated properties
      const newCubeAxes = vtkCubeAxesActor.newInstance();
      newCubeAxes.setAxisLabelsFrom(axisLabels);
      newCubeAxes.setDataBounds(updatedCombinedBounds);
      newCubeAxes.setCamera(context.current.fullScreenRenderer.getRenderer().getActiveCamera());

      // Store the new cube axes actor in the context
      context.current.cubeAxes = newCubeAxes;
      // Add the new cube axes actor to the renderer
      context.current.fullScreenRenderer.getRenderer().addActor(newCubeAxes);

      context.current.actor2.setPosition(0, 0, spaceBetweenLayers);
      context.current.fullScreenRenderer.getRenderWindow().render();
    }
  }, [spaceBetweenLayers]);

  // useEffect for handling opacityValue changes
  useEffect(() => {
    if (context.current) {
      // Update the opacity of actor1 (first layer)
      context.current.actor1.getProperty().setOpacity(opacityValue1);
      // Update the opacity of actor2 (second layer)
      context.current.actor2.getProperty().setOpacity(opacityValue2);
      context.current.fullScreenRenderer.getRenderWindow().render();
    }
  }, [opacityValue1, opacityValue2]);

  // useEffect for handling layer2Color changes
  useEffect(() => {
    if (context.current) {
      const colorArray = hexToRgbFraction(layer2Color);
      context.current.actor2.getProperty().setColor(...colorArray);
      context.current.fullScreenRenderer.getRenderWindow().render();
    }
  }, [layer2Color]);

  return (
    <>
      <ControlsE4
        layer1Visible={layer1Visible}
        layer2Visible={layer2Visible}
        spaceBetweenLayers={spaceBetweenLayers}
        opacityValue1={opacityValue1}
        opacityValue2={opacityValue2}
        layer2Color={layer2Color}
        onLayer1VisibleChange={setLayer1Visible}
        onLayer2VisibleChange={setLayer2Visible}
        onSpaceBetweenLayersChange={setSpaceBetweenLayers}
        onOpacityValue1Change={setOpacityValue1}
        onOpacityValue2Change={setOpacityValue2}
        onLayer2ColorChange={setLayer2Color}
      />
      <div
        ref={vtkContainerRef}
        style={{width: '100%', height: '100vh'}}
      />
    </>
  );
};

export default VtkExample4;
