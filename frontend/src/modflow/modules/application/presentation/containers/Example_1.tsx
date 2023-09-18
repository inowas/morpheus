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

      actor.onModified(() => {
        console.log('actor modified');
      });

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();

      renderer.getActiveCamera().onModified((instance) => {

        //console.log('camera modified');
        //console.log(instance);

        /*        const majorAxis = (vec3, idxA, idxB) => {
          const axis = [0, 0, 0];
          const idx = Math.abs(vec3[idxA]) > Math.abs(vec3[idxB]) ? idxA : idxB;
          const value = 0 < vec3[idx] ? 1 : -1;
          axis[idx] = value;
          return axis;
        };

        const focalPoint = instance.getFocalPoint();
        const position = instance.getPosition();
        const viewUp = instance.getViewUp();

        const distance = Math.sqrt(
          vtkMath.distance2BetweenPoints(position, focalPoint),
        );

        instance.setPosition(
          focalPoint[0] + 1 * distance,
          focalPoint[1] + 0 * distance,
          focalPoint[2] + 0 * distance,
        );

        instance.setViewUp(majorAxis(viewUp, 1, 2));*/
      });

      //const interactor = renderWindow.getInteractor();
      //interactor.onMouseMove(e => console.log(e));

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

