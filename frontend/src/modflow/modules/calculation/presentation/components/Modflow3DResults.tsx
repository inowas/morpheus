import React, {useEffect, useRef} from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';

interface IProps {
  topElevation: {
    imgUrl: string;
    dataUrl: string;
  },
  heads: {
    imgUrl?: string;
    dataUrl: string;
  }[],
  topElevationVisible: boolean;
  topElevationOpacity: number;
}

const setTexture = (actor: vtkActor, imgUrl: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function textureLoaded() {
      const texture = vtkTexture.newInstance();
      texture.setInterpolate(true);
      texture.setImage(img);
      actor.addTexture(texture);
      resolve(texture);
    };
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;
  });
};

const setData = (reader: vtkElevationReader, dataUrl: string) => {
  return new Promise((resolve, reject) => {
    fetch(dataUrl).then(async (response) => {
      const data = await response.json();
      reader.parseAsText(data.map((row: []) => row.join(',')).join('\n'));
      resolve(reader);
    });
  });
};

const setTopElevation = (imgUrl: string, dataUrl: string, renderer: vtkFullScreenRenderWindow) => {
  const topElevationReader = vtkElevationReader.newInstance({
    xSpacing: 1,
    ySpacing: 1,
    zScaling: 2,
  });
  const topElevationMapper = vtkMapper.newInstance();
  topElevationMapper.setInputConnection(topElevationReader.getOutputPort());
  const topElevationActor = vtkActor.newInstance();
  topElevationActor.setMapper(topElevationMapper);
  renderer.getRenderer().addActor(topElevationActor);

  // Download and apply Texture
  setTexture(topElevationActor, imgUrl).then(() => {
    renderer.getRenderer().resetCamera();
    renderer.getRenderWindow().render();
  });

  // Download and set data
  setData(topElevationReader, dataUrl).then(() => {
    renderer.getRenderer().resetCamera();
    renderer.getRenderWindow().render();
  });

  return topElevationActor;
};

const setHead = (dataUrl: string, imgUrl: string | undefined, renderer: vtkFullScreenRenderWindow) => {
  const headReader = vtkElevationReader.newInstance({
    xSpacing: 1,
    ySpacing: 1,
    zScaling: 2,
  });
  const headMapper = vtkMapper.newInstance();
  headMapper.setInputConnection(headReader.getOutputPort());
  const headActor = vtkActor.newInstance();
  headActor.setMapper(headMapper);
  renderer.getRenderer().addActor(headActor);


  // Download and apply Texture
  if (imgUrl) {
    setTexture(headActor, imgUrl).then(() => {
      renderer.getRenderer().resetCamera();
      renderer.getRenderWindow().render();
    });
  }

  // Download and set data
  setData(headReader, dataUrl).then(() => {
    renderer.getRenderer().resetCamera();
    renderer.getRenderWindow().render();
  });
};

const Modflow3DResults: React.FC<IProps> = (
  {
    topElevation,
    heads,
    topElevationVisible,
    topElevationOpacity,
  }) => {

  const vtkContainerRef = useRef<any>(null);
  const context = useRef<{ renderer: vtkFullScreenRenderWindow, topElevationActor: vtkActor } | null>(null);

  useEffect(() => {
    const renderer = vtkFullScreenRenderWindow.newInstance({container: vtkContainerRef.current});
    const topElevationActor = setTopElevation(topElevation.imgUrl, topElevation.dataUrl, renderer);
    const camera = renderer.getRenderer().getActiveCamera();
    const defaultFocalPoint: [number, number, number] = [1, 0, 0];
    const defaultPosition: [number, number, number] = [-1, 2, 1];
    const defaultViewUp: [number, number, number] = [0, 0, 1];
    camera.setFocalPoint(...defaultFocalPoint);
    camera.setPosition(...defaultPosition);
    camera.setViewUp(...defaultViewUp);

    renderer.getInteractor().onAnimation(() => {
      camera.setViewUp(...defaultViewUp);
    });

    heads.forEach((head) => {
      setHead(head.dataUrl, head.imgUrl, renderer);
    });

    context.current = {renderer, topElevationActor};

    return () => {
      if (context.current) {
        context.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!context.current) {
      return;
    }
    const {renderer, topElevationActor} = context.current;
    topElevationActor.setVisibility(topElevationVisible);
    topElevationActor.getProperty().setOpacity(topElevationOpacity);
    renderer.getRenderWindow().render();
  }, [topElevationVisible, topElevationOpacity]);

  return (
    <div ref={vtkContainerRef} style={{width: '100%', height: '100vh'}}/>
  );
};

export {Modflow3DResults};
