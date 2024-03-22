import os
import tempfile
from flask import Request, Response, jsonify
from werkzeug.exceptions import HTTPException
from werkzeug.utils import secure_filename
from morpheus.common.types.File import FilePath, FileName


def move_uploaded_file_to_tmp_dir(request_files_key: str, request: Request) -> {FileName, FilePath}:
    def raise_error(description: str, status_code: int):
        response = jsonify()
        response.status_code = status_code
        raise HTTPException(description=description, response=Response(status=400))

    if request_files_key not in request.files:
        raise_error('No file uploaded', 400)

    file = request.files[request_files_key]
    if file.filename == '':
        raise_error('No file uploaded', 400)

    filename = secure_filename(file.filename)
    _, extension = os.path.splitext(filename)

    handle, full_path = tempfile.mkstemp(suffix=extension)
    os.close(handle)
    file.save(full_path)

    return FileName(filename), FilePath(full_path)


def remove_uploaded_file(full_path: str):
    os.remove(full_path)










