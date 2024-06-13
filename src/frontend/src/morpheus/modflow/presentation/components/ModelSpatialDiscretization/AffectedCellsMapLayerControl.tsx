import React, {useEffect, useRef} from 'react';
import {useMap} from 'common/infrastructure/React-Leaflet';
import {L} from 'common/infrastructure/Leaflet';


interface IProps {
  showAffectedCells: boolean;
  onChangeShowAffectedCells: (showAffectedCells: boolean) => void;
  editAffectedCells?: boolean;
  onChangeEditAffectedCells: (editAffectedCells: boolean) => void;
  isReadOnly: boolean;
}


const AffectedCellsMapLayerControl = ({editAffectedCells, showAffectedCells, onChangeEditAffectedCells, onChangeShowAffectedCells, isReadOnly}: IProps) => {

  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);
  const showAffectedCellsButtonRef = useRef<HTMLButtonElement | null>(null);
  const editAffectedCellsButtonRef = useRef<HTMLButtonElement | null>(null);

  const editAffectedCellsRef = useRef<boolean>(editAffectedCells || false);
  const showAffectedCellsRef = useRef<boolean>(showAffectedCells);
  const isReadOnlyRef = useRef<boolean>(isReadOnly);

  useEffect(() => {
    const AffectedCellsControl = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create('div', 'custom-control-container');
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #bbb';

        const showAffectedCellsButton = L.DomUtil.create('button', 'custom-button', container);
        showAffectedCellsButton.innerHTML = '<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor">\n' +
          '    <path d="M4 4h16v16H4z" fill="#fff" stroke="#000" strokeWidth="2" />\n' +
          '    <path d="M8 4v16M16 4v16M4 8h16M4 16h16" stroke="#000" strokeWidth="2" />\n' +
          '    <!-- Eye icon for view mode -->\n' +
          '    <circle cx="12" cy="12" r="3" fill="none" stroke="#000" strokeWidth="2"/>\n' +
          '    <path d="M9 12h6M12 9v6" stroke="#000" strokeWidth="2"/>\n' +
          '    <!-- Bigger grin -->\n' +
          '    <path d="M8 14h8M9 15h6" stroke="#000" strokeWidth="2"/>\n' +
          '</svg></span>';
        showAffectedCellsButton.style.backgroundColor = showAffectedCells ? '#ccc' : 'white';
        showAffectedCellsButton.style.border = '1px solid #bbb';
        showAffectedCellsButton.style.padding = '0';
        showAffectedCellsButton.style.cursor = 'pointer';
        showAffectedCellsButton.style.display = 'block';
        L.DomEvent.on(showAffectedCellsButton, 'click', () => onChangeShowAffectedCells(!showAffectedCellsRef.current))
        showAffectedCellsButtonRef.current = showAffectedCellsButton;

        const editAffectedCellsButton = L.DomUtil.create('button', 'custom-button-2', container);
        editAffectedCellsButton.innerHTML = '<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor">\n' +
          '    <!-- Grid -->\n' +
          '    <path d="M4 4h16v16H4z" fill="#fff" stroke="#000" strokeWidth="2" />\n' +
          '    <path d="M8 4v16M16 4v16M4 8h16M4 16h16" stroke="#000" strokeWidth="2" />\n' +
          '    <!-- Pencil icon for edit mode -->\n' +
          '    <path d="M17.8 3.69a3 3 0 1 1 0 4.24L7.47 18.36a2.57 2.57 0 0 1-1.47.77 1.72 1.72 0 0 1-.69-.15 1.65 1.65 0 0 1-.51-.33L3 17l1.17-1.17 2.12 2.12L5.3 18l-1.9-1.9 2.12-2.12L2 13.7l2.12-2.12 2.83 2.83L7.3 14.3l-1.9-1.9 2.12-2.12L6 9.7l2.12-2.12 4.24 4.24 2.12-2.12L11.5 7.3l2.12-2.12a3 3 0 0 1 4.24 0zM20 6l-2-2"></path>\n' +
          '</svg></span>';

        editAffectedCellsButton.style.backgroundColor = editAffectedCells ? '#ccc' : 'white';
        editAffectedCellsButton.style.border = '1px solid #bbb';
        editAffectedCellsButton.style.padding = '0';
        editAffectedCellsButton.style.cursor = 'pointer';
        editAffectedCellsButton.style.display = showAffectedCells ? 'block' : 'none';
        L.DomEvent.on(editAffectedCellsButton, 'click', () => onChangeEditAffectedCells(!editAffectedCellsRef.current));
        editAffectedCellsButtonRef.current = editAffectedCellsButton;

        L.DomEvent.disableClickPropagation(container);
        return container;
      },

      onRemove: function () {
        // Nothing to do here
      }
    });

    controlRef.current = new AffectedCellsControl({position: 'topleft'});
    map.addControl(controlRef.current);
    return () => {
      if (controlRef.current && map) {
        map.removeControl(controlRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    editAffectedCellsRef.current = editAffectedCells || false;
    showAffectedCellsRef.current = showAffectedCells;
    if (!showAffectedCells) {
      onChangeEditAffectedCells(false);
    }
    isReadOnlyRef.current = isReadOnly;
    showAffectedCellsButtonRef.current?.style.setProperty('background-color', showAffectedCells ? '#ccc' : 'white');
    editAffectedCellsButtonRef.current?.style.setProperty('background-color', editAffectedCells ? '#ccc' : 'white');
    editAffectedCellsButtonRef.current?.style.setProperty('display', showAffectedCells ? 'block' : 'none');
  }, [editAffectedCells, showAffectedCells, isReadOnly]);

  return null;
};

export default AffectedCellsMapLayerControl;
