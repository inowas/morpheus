import numpy as np
import pandas as pd
import os
import re


class ParsingHeaderErrorException(Exception):
    pass


class EmptyCsvFileException(Exception):
    pass


class UitCsvFileReader:
    def __init__(self, file_path, time_field='timestamp') -> None:
        if os.path.exists(file_path) is False:
            raise FileNotFoundError(f"File {file_path} does not exist")

        self.file_path = file_path
        self.time_field = time_field
        self.df = self.parse()

    def parse(self) -> pd.DataFrame:
        try:
            df = pd.read_csv(self.file_path, sep=";", encoding="ISO-8859-1")
            df.columns.values[0] = "{timestamp}"
            df.rename(columns=self.parse_header, inplace=True)
            df.replace({np.nan: None}, inplace=True)
            df[self.time_field] = pd.to_datetime(df['timestamp'], dayfirst=True)
            return df
        except pd.errors.EmptyDataError:
            raise EmptyCsvFileException(f"File {self.file_path} is empty")
        except ParsingHeaderErrorException:
            raise ParsingHeaderErrorException(f"Could not parse header of file {self.file_path}")

    def to_dataframe(self) -> pd.DataFrame:
        return self.df

    def to_dict(self) -> list[dict]:
        return self.df.to_dict('records')

    def parameters(self) -> list[str]:
        return self.df.columns.tolist()[1:]

    @staticmethod
    def parse_header(header):
        res = re.findall(r'\{.*?}', header)
        if len(res) > 0:
            return res[0].replace("{", "").replace("}", "")
        raise ParsingHeaderErrorException("No header variable within {} found")
