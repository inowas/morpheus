from morpheus.common.infrastructure.cli.io import write_success, write_error
from morpheus.datahub.application.write.sensors import has_sensor, add_sensor, insert_records
import os
import pandas as pd
import re
import time


class ParsingHeaderErrorException(Exception):
    pass


class ReadUITSensorDataFromCSVFilesCliCommand:
    def run(self, src_path: str, target_path_success: str, target_path_error: str):
        file_count = 0
        row_count = 0
        new_collection_count = 0
        file_headers_error_count = 0
        file_empty_count = 0
        start_time_ns = time.time_ns()

        for file in sorted(os.listdir(src_path)):
            try:
                project, sensor, _ = re.findall(r'(.*)_(.*)_(.*)\.csv', file)[0]
                filename = os.fsdecode(os.path.join(src_path, file))
                df = pd.read_csv(filename, sep=";", encoding="ISO-8859-1")
                df.columns.values[0] = "{timestamp}"
                df.rename(columns=self.parse_header, inplace=True)
                df.mask(df.isna(), None, inplace=True)
                df['timestamp'] = pd.to_datetime(df['timestamp'], dayfirst=True)
                sensor_name = f"sensor_{project}_{sensor}"
                if not has_sensor(sensor_name):
                    new_collection_count += 1
                    add_sensor(sensor_name)

                insert_records(sensor_name, df.to_dict('records'))
                file_count += 1
                row_count += len(df.index)
                os.rename(os.path.join(src_path, file), os.path.join(target_path_success, file))
                write_success(f"Successfully parsed file {file}")
                continue
            except pd.errors.EmptyDataError:
                os.rename(os.path.join(src_path, file), os.path.join(target_path_success, file))
                file_empty_count += 1
                continue
            except ParsingHeaderErrorException:
                write_error(f"Could not parse header of file {file}")
                file_headers_error_count += 1
            except Exception as e:
                write_error(f"Could not parse file {file}")
                print(e)

            write_error(f"Parsing file {file} failed")
            os.rename(os.path.join(src_path, file), os.path.join(target_path_error, file))

        duration_ns = (time.time_ns() - start_time_ns)
        write_success("Finished reading files")
        write_success(f"{file_count} files read")
        write_success(f"{new_collection_count} new Sensors added")
        write_success(f"{row_count} rows inserted")
        write_success(f"Files with empty data: {file_empty_count}")
        write_success(f"Files with header errors: {file_headers_error_count}")
        write_success(f"Total duration: {round(duration_ns / 1000000000, 3)} seconds")

    @staticmethod
    def parse_header(header: str):
        res = re.findall(r'\{.*?}', header)
        if len(res) > 0:
            return res[0].replace("{", "").replace("}", "")
        raise ParsingHeaderErrorException("No header variable within {} found")
