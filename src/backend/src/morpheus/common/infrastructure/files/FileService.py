import magic
import os
from morpheus.common.types.File import FilePath, File, FileName, FileSize


class FileService:
    @staticmethod
    def build_file_info(file_path: FilePath, custom_filename: FileName | None = None) -> File:
        filename = os.path.basename(file_path) if custom_filename is None else custom_filename
        size = os.path.getsize(file_path)
        mimetype = magic.from_file(file_path, mime=True)

        return File(filename=FileName(filename), size=FileSize(size), mimetype=mimetype)

