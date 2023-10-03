import React, {useEffect, useRef} from 'react';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkElevationReader from '@kitware/vtk.js/IO/Misc/ElevationReader';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkTexture from '@kitware/vtk.js/Rendering/Core/Texture';
import {IData, IVisibility} from '../../types';

interface IProps {
  data: IData[],
  visibility: IVisibility[],
  zScaling: number;
}

const setTexture = (actor: vtkActor, imgUrl: string) => {
  return new Promise((resolve) => {
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

  const mean = Math.round(sum / count * 100) / 100;

  return data.map((row: Array<number | null>) => row.map((value: number | null) => {
    if (null === value) {
      return mean;
    }

    return value;
  }));
};

const setData = (reader: vtkElevationReader, dataUrl: string) => {
  return new Promise((resolve) => {
    fetch(dataUrl).then(async (response) => {
      let data = await response.json();
      data = fillNullValuesWithNearest(data);
      reader.parseAsText(data.map((row: []) => row.join(',')).join('\n'));
      reader.update();
      resolve(reader);
    });
  });
};

const addDataLayer = (imgUrl: string, dataUrl: string, renderer: vtkFullScreenRenderWindow, zScaling: number) => {
  const reader = vtkElevationReader.newInstance({
    xSpacing: 1,
    ySpacing: 1,
    zScaling: zScaling,
  });
  const mapper = vtkMapper.newInstance();
  mapper.setInputConnection(reader.getOutputPort());
  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  renderer.getRenderer().addActor(actor);

  // Download and apply Texture
  setTexture(actor, imgUrl).then(() => {
    renderer.getRenderer().resetCamera();
    renderer.getRenderWindow().render();
  });

  // Download and set data
  setData(reader, dataUrl).then(() => {
    renderer.getRenderer().resetCamera();
    renderer.getRenderWindow().render();
  });

  return {actor, reader};
};

const Modflow3DResults: React.FC<IProps> = ({
  data,
  visibility,
  zScaling,
}) => {

  const vtkContainerRef = useRef<any>(null);
  const context = useRef<{
    renderer: vtkFullScreenRenderWindow,
    actors: {
      [id: string]: vtkActor
    },
    readers: {
      [id: string]: vtkElevationReader
    }
  } | null>(null);

  useEffect(() => {
    const renderer = vtkFullScreenRenderWindow.newInstance({container: vtkContainerRef.current});
    const actors: { [id: string]: vtkActor } = {};
    const readers: { [id: string]: vtkElevationReader } = {};

    data.forEach((dataLayer) => {
      const {actor, reader} = addDataLayer(dataLayer.imgUrl, dataLayer.dataUrl, renderer, zScaling);
      actor.setVisibility(visibility.find((v) => v.id === dataLayer.id)?.isVisible || false);
      actor.getProperty().setOpacity(visibility.find((v) => v.id === dataLayer.id)?.opacity || 1);
      actors[dataLayer.id as string] = actor;
      readers[dataLayer.id] = reader;
    });

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

    context.current = {renderer, actors, readers};

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
    const {renderer, actors} = context.current;
    visibility.forEach((v) => {
      if (actors[v.id]) {
        actors[v.id].setVisibility(v.isVisible);
        actors[v.id].getProperty().setOpacity(v.opacity);
      }
    });

    renderer.getRenderWindow().render();
  }, [visibility]);

  useEffect(() => {
    if (!context.current) {
      return;
    }

    const {renderer, actors, readers} = context.current;

    data.forEach((dataLayer) => {
      const actor = actors[dataLayer.id];
      actor.removeAllTextures();
      setTexture(actor, dataLayer.imgUrl).then(() => {
        renderer.getRenderer().resetCamera();
        renderer.getRenderWindow().render();
      });
      const reader = readers[dataLayer.id];
      setData(reader, dataLayer.dataUrl).then(() => {
        renderer.getRenderer().resetCamera();
        renderer.getRenderWindow().render();
      });
    });
  }, [data]);

  useEffect(() => {
    if (!context.current) {
      return;
    }
    const {renderer, readers} = context.current;
    Object.values(readers).forEach((reader) => {
      reader.setZScaling(zScaling);
      reader.update();
    });
    renderer.getRenderer().resetCamera();
    renderer.getRenderWindow().render();
  }, [zScaling]);

  return (
    <div ref={vtkContainerRef} style={{width: '100%', height: '100vh'}}/>
  );
};

export {Modflow3DResults};
