import type {FC} from 'react';
import React, {useCallback, useEffect, useState} from 'react';
import TargetBox from './TargetBox';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

export interface ILogoDropzoneProps {
  logo: string | null;
  // returns base64 encoded image
  onChange?: (base64EncodedString: string | null) => void;
  onChangeFile?: (file: File | null) => void;
  overlayText: string;
  deleteText: string;
  allowedMimetypes?: string[];
  mimeTypeErrorText: string;
  filesizeExceededErrorText: string;
  maxFileSizeInKb: number;
}

const permittedMimetypes: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
];

const Dropzone: FC<ILogoDropzoneProps> = ({
  onChange,
  onChangeFile,
  logo,
  overlayText,
  deleteText,
  mimeTypeErrorText,
  filesizeExceededErrorText,
  maxFileSizeInKb,
  allowedMimetypes,
}) => {

  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback(
    (item: { files: File[] }) => {
      setError(null);

      if (onChange) {
        onChange(null);
      }

      if (onChangeFile) {
        onChangeFile(null);
      }

      setDroppedFile(null);
      if (item && item.files && item.files.length) {
        const file = item.files[0];
        const checkMimetypes = () => {
          return allowedMimetypes ? !allowedMimetypes.includes(file.type) : !permittedMimetypes.includes(file.type);
        };
        if (checkMimetypes()) {
          return setError(mimeTypeErrorText);
        }

        if (file.size > (maxFileSizeInKb * 1024)) {
          return setError(filesizeExceededErrorText);
        }

        return setDroppedFile(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setDroppedFile],
  );

  const handleCancelFileDrop = useCallback(() => {
    setError(null);
    setDroppedFile(null);
    if (onChange) {
      onChange(null);
    }

    if (onChangeFile) {
      onChangeFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDroppedFile]);

  useEffect(() => {
    if (droppedFile) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        if (onChange) {
          onChange(reader.result as string);
        }
        if (onChangeFile) {
          onChangeFile(droppedFile);
        }
      }, false);
      reader.readAsDataURL(droppedFile);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [droppedFile]);

  return (
    <DndProvider backend={HTML5Backend}>
      <TargetBox
        allowedMimetypes={allowedMimetypes}
        onDrop={handleFileDrop}
        onCancel={handleCancelFileDrop}
        logo={logo}
        overlayText={overlayText}
        deleteText={deleteText}
        error={error}
      />
    </DndProvider>
  );
};

export default Dropzone;
