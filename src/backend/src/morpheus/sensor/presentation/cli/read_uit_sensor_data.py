import fnmatch
import os
import re
import time
from ftplib import FTP

from morpheus.common.infrastructure.cli.io import write_error, write_success
from morpheus.sensor.application.write.sensors import add_sensor, has_sensor, insert_records, is_already_recorded
from morpheus.sensor.infrastructure.filereaders.UitCsvFileReader import EmptyCsvFileException, ParsingCsvErrorException, ParsingHeaderErrorException, UitCsvFileReader
from morpheus.settings import settings


def read_uit_sensor_data_from_csv_files_cli_command():
    file_count = 0
    row_count = 0
    new_collection_count = 0
    file_error_count = 0
    file_empty_count = 0
    start_time_ns = time.time_ns()

    data_path = settings.MORPHEUS_SENSOR_LOCAL_DATA
    inbox_path = os.path.join(data_path, 'inbox')
    error_path = os.path.join(data_path, 'error')
    archive_path = os.path.join(data_path, 'archive')
    if not os.path.exists(inbox_path):
        os.mkdir(inbox_path)
    if not os.path.exists(error_path):
        os.mkdir(error_path)
    if not os.path.exists(archive_path):
        os.mkdir(archive_path)

    write_success('Creating list of already downloaded files')
    already_downloaded_files = os.listdir(inbox_path) + os.listdir(error_path) + os.listdir(archive_path)
    already_downloaded_files = fnmatch.filter(already_downloaded_files, '*.csv')
    write_success('Finished creating list of already downloaded files.')
    write_success(f'Found {len(already_downloaded_files)} files')

    # sync files over ftp to inbox folder
    write_success('Connecting to FTP server')
    ftp = FTP(settings.MORPHEUS_SENSORS_UIT_FTP_HOST)
    ftp.login(user=settings.MORPHEUS_SENSORS_UIT_FTP_USER, passwd=settings.MORPHEUS_SENSORS_UIT_FTP_PASSWORD)
    ftp.cwd(settings.MORPHEUS_SENSORS_UIT_FTP_PATH)

    write_success('Downloading files list')
    files_on_ftp = ftp.nlst()
    files_on_ftp = fnmatch.filter(files_on_ftp, '*.csv')
    files_on_ftp.sort()
    write_success(f'Found {len(files_on_ftp)} files on FTP server')

    list_to_download = set(files_on_ftp) - set(already_downloaded_files)
    write_success(f'Found {len(list_to_download)} files to download')

    for file_to_download in list_to_download:
        if file_to_download.endswith('.csv') and file_to_download not in already_downloaded_files:
            write_success('Downloading... ' + file_to_download)
            try:
                with open(os.path.join(inbox_path, file_to_download), 'wb') as f:
                    ftp.retrbinary('RETR ' + file_to_download, f.write)
            except EOFError:  # To avoid EOF errors.
                pass
    ftp.quit()
    write_success('Finished downloading files')

    # parse files and store file data from inbox folder to mongodb
    files_to_parse = fnmatch.filter(os.listdir(inbox_path), '*.csv')
    for filename in sorted(files_to_parse):
        filepath = os.fsdecode(os.path.join(inbox_path, filename))
        try:
            project, sensor, _ = re.findall(r'(.*)_(.*)_(.*)\.csv', filename)[0]
            sensor_id = f'sensor_{project}_{sensor}'
            try:
                filereader = UitCsvFileReader(filepath, time_field='timestamp')
                rows = filereader.to_dict()

                for row in rows:
                    row['metadata'] = {
                        'sensor_id': sensor_id,
                        'project': project,
                        'sensor': sensor,
                        'source': 'uit',
                        'parameters': filereader.parameters(),
                    }
                    row['filename'] = filename

                if not has_sensor(sensor_id):
                    write_success(f'Adding new sensor {sensor_id}')
                    add_sensor(sensor_id, time_field='timestamp', meta_field='metadata', granularity='minutes')
                    new_collection_count += 1

                if is_already_recorded(sensor_id, filename, 'uit'):
                    write_success(f'File {filename} is already recorded. Skipping...')
                    file_count += 1
                    os.rename(filepath, os.path.join(archive_path, filename))
                    continue

                insert_records(sensor_id, rows)
                file_count += 1
                row_count += len(rows)
                os.rename(filepath, os.path.join(archive_path, filename))
                write_success(f'Successfully parsed file {filename}. ({file_count}/{len(files_to_parse)})')

            except EmptyCsvFileException:
                os.rename(filepath, os.path.join(archive_path, filename))
                file_empty_count += 1
                write_error(f'File {filename} is empty. ({file_count}/{len(files_to_parse)})')

            except ParsingCsvErrorException:
                os.rename(filepath, os.path.join(error_path, filename))
                file_error_count += 1
                write_error(f'Could not parse csv of file {filename}. ({file_count}/{len(files_to_parse)})')

            except ParsingHeaderErrorException:
                os.rename(filepath, os.path.join(error_path, filename))
                file_error_count += 1
                write_error(f'Could not parse header of file {filename}. ({file_count}/{len(files_to_parse)})')

        except Exception as e:
            raise e

    duration_ns = time.time_ns() - start_time_ns
    write_success('Finished reading files')
    write_success(f'{file_count} files read')
    write_success(f'{new_collection_count} new Sensors added')
    write_success(f'{row_count} rows inserted')
    write_success(f'Files with empty data: {file_empty_count}')
    write_success(f'Files with header errors: {file_error_count}')
    write_success(f'Total duration: {round(duration_ns / 1000000000, 3)} seconds')
