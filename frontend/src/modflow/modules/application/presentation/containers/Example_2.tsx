import React, {useEffect, useRef} from 'react';
import demImage from '../images/dem.jpg';
import demData from '../data/dem.csv';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';


const renderWindowSetup = (container: HTMLDivElement) => {
  // Standard rendering code setup
  const renderWindow = vtkRenderWindow.newInstance();
  const renderer = vtkRenderer.newInstance({});
  renderer.setBackground([0.0, 0.0, 0.0, 0.0]);

  renderWindow.addRenderer(renderer);

  // Use OpenGL as the backend to view the all this
  const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
  renderWindow.addView(openglRenderWindow);

  openglRenderWindow.setContainer(container);

  // Capture size of the container and set it to the renderWindow
  // const {width, height} = container.getBoundingClientRect();
  // openglRenderWindow.setSize(width, height);

  // Setup an interactor to handle mouse events
  const interactor = vtkRenderWindowInteractor.newInstance();
  interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
  interactor.setView(openglRenderWindow);
  interactor.initialize();
  interactor.bindEvents(container);

  return {renderer, renderWindow, interactor};
};

const VtkExample2 = () => {
  const vtkContainerRef = useRef<HTMLDivElement | null>(null);
  const context = useRef<any>(null);

  useEffect(() => {
    if (!context.current) {
      const {renderer, renderWindow, interactor} = renderWindowSetup(
        vtkContainerRef.current as HTMLDivElement,
      );

      const elevationReader = vtkElevationReader.newInstance({
        xSpacing: 0.01568,
        ySpacing: 0.01568,
        zScaling: 0.06666,
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(elevationReader.getOutputPort());

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

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
        renderer,
        renderWindow,
        interactor,
        actor,
        mapper,
        img,
        elevationReader,
      };
    }

    return () => {
      if (context.current) {
        context.current = null;
      }
    };
  }, []);

  return (
    <>
      <header
        className="App-header"
        style={{
          position: 'absolute',
          textAlign: 'center',
          zIndex: 1000,
          color: 'red',
          width: '100%',
        }}
      >
        <h2>3D model with elevation data</h2>
      </header>
      <div
        ref={vtkContainerRef} style={{
          position: 'relative',
          background: 'orange',
          width: 500,
          height: 500,
        }}
      />
    </>
  );
};

export default VtkExample2;
