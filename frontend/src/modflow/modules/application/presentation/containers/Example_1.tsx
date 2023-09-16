import React, {useRef, useEffect, useState} from 'react';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import ControlsE1 from '../components/ControlsE1';

const VtkExample = () => {
  const vtkContainerRef = useRef<any>(undefined);
  const context = useRef<any>(undefined);
  const [coneResolution, setConeResolution] = useState(6);
  const [representation, setRepresentation] = useState(2);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        container: vtkContainerRef.current,
        background: [0.22, 0.24, 0.33, 0.95],
      });

      const coneSource = vtkConeSource.newInstance({
        height: 1.0,
      });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(coneSource.getOutputPort());

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer,
        renderWindow,
        renderer,
        coneSource,
        actor,
        mapper,
      };
    }

    return () => {
      if (context.current) {
        const {fullScreenRenderer, coneSource, actor, mapper} = context.current;
        actor.delete();
        mapper.delete();
        coneSource.delete();
        fullScreenRenderer.delete();
        context.current = null;
      }
    };
  }, [vtkContainerRef]);

  window.test = context.current?.fullScreenRenderer;

  useEffect(() => {
    if (context.current) {
      const {coneSource, renderWindow} = context.current;
      coneSource.setResolution(coneResolution);
      renderWindow.render();
    }
  }, [coneResolution]);

  useEffect(() => {
    if (context.current) {
      const {actor, renderWindow} = context.current;
      actor.getProperty().setRepresentation(representation);
      renderWindow.render();
    }
  }, [representation]);

  return (
    <>
      <div
        ref={vtkContainerRef}
        style={{
          position: 'absolute',
          width: 'calc(100vw - 20px)',
          height: 'calc(100vh - 20px)',
          top: 10,
          left: 10,
        }}
      />
      <ControlsE1
        coneResolution={coneResolution}
        representation={representation}
        onChangeConeResolution={setConeResolution}
        onChangeRepresentation={setRepresentation}
      />
    </>
  );
};

export default VtkExample;

