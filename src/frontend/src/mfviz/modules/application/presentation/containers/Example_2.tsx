import React, {useEffect, useRef} from 'react';

import demData from '../data/dem.csv';
import demImage from '../images/dem.jpg';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';

const VtkExample2 = () => {
  const vtkContainerRef = useRef<any>(null);
  const context = useRef<any>(null);

  useEffect(() => {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      container: vtkContainerRef.current,
      background: [0, 0, 0],
    });

    const elevationReader = vtkElevationReader.newInstance({
      xSpacing: 0.01568,
      ySpacing: 0.01568,
      zScaling: 0.06666,
    });

    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(elevationReader.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    // Download and apply Texture
    const img = new Image();
    img.onload = function textureLoaded() {
      const texture = vtkTexture.newInstance();
      texture.setInterpolate(true);
      texture.setImage(img);
      actor.addTexture(texture);
      renderWindow.render();
    };
    img.src = demImage;

    elevationReader.parseAsText(demData.map((row: []) => row.join(',')).join('\n'));
    renderer.resetCamera();
    renderWindow.render();

    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();

    context.current = {
      fullScreenRenderer,
      actor,
      mapper,
      img,
      elevationReader,
    };

    return () => {
      if (context.current) {
        context.current = null;
      }
    };
  }, []);

  return <>
    <header
      className="App-header"
      style={{position: 'absolute', textAlign: 'center', zIndex: 1000, color: 'red', width: '100%'}}
    >
      <h2>3D model with elevation data</h2>
    </header>
    <div ref={vtkContainerRef} style={{width: '100%', height: '100vh'}}/>
  </>;
};

export default VtkExample2;
