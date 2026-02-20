import os
import tempfile

from flask import abort, request
from werkzeug.utils import secure_filename

from morpheus.common.types.File import FileName, FilePath


def move_uploaded_files_to_tmp_dir(request_files_key: str, max_allowed_number_of_files: int | None = None) -> list[tuple[FileName, FilePath]]:
    if request_files_key not in request.files:
        abort(400, 'No file uploaded')

    files = request.files.getlist(request_files_key)
    if max_allowed_number_of_files is not None and len(files) != max_allowed_number_of_files:
        abort(400, f'Only {max_allowed_number_of_files} files are allowed, but {len(files)} were uploaded')

    list_of_files = []
    for file in files:
        filename = secure_filename(file.filename) if file.filename is not None else ''
        if filename == '':
            abort(400, 'Filename is empty or invalid')

        _, extension = os.path.splitext(filename)

        handle, full_path = tempfile.mkstemp(suffix=extension)
        os.close(handle)
        file.save(full_path)

        list_of_files.append((FileName(filename), FilePath(full_path)))

    return list_of_files


def remove_uploaded_file(full_path: str):
    os.remove(full_path)
