import numpy as np
import pandas as pd
import os
import re


class ParsingHeaderErrorException(Exception):
    pass


class EmptyCsvFileException(Exception):
    pass


class UitCsvFileReader:
    def __init__(self, file_path):
        if os.path.exists(file_path) is False:
            raise FileNotFoundError(f"File {file_path} does not exist")

        self.file_path = file_path

    def to_dataframe(self) -> pd.DataFrame:
        try:
            df = pd.read_csv(self.file_path, sep=";", encoding="ISO-8859-1")
            df.columns.values[0] = "{timestamp}"
            df.rename(columns=self.parse_header, inplace=True)
            df.replace({np.nan: None}, inplace=True)
            df['timestamp'] = pd.to_datetime(df['timestamp'], dayfirst=True)
            return df
        except pd.errors.EmptyDataError:
            raise EmptyCsvFileException(f"File {self.file_path} is empty")
        except ParsingHeaderErrorException:
            raise ParsingHeaderErrorException(f"Could not parse header of file {self.file_path}")

    def to_dict(self) -> list[dict]:
        df = self.to_dataframe()
        return df.to_dict('records')

    @staticmethod
    def parse_header(header):
        res = re.findall(r'\{.*?}', header)
        if len(res) > 0:
            return res[0].replace("{", "").replace("}", "")
        raise ParsingHeaderErrorException("No header variable within {} found")
