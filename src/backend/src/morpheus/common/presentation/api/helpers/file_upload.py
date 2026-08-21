import os
import shutil
import tempfile

from werkzeug.utils import secure_filename

from morpheus.common.types.File import FileName, FilePath


def save_uploaded_file(filename: str | None, source) -> tuple[FileName, FilePath]:
    safe_filename = secure_filename(filename) if filename is not None else ''
    if safe_filename == '':
        raise ValueError('Filename is empty or invalid')

    _, extension = os.path.splitext(safe_filename)
    handle, full_path = tempfile.mkstemp(suffix=extension)
    os.close(handle)
    with open(full_path, 'wb') as target:
        shutil.copyfileobj(source, target)
    return FileName(safe_filename), FilePath(full_path)


def remove_uploaded_file(full_path: str):
    os.remove(full_path)
