import dataclasses
import pyproj


@dataclasses.dataclass(frozen=True)
class Crs:
    # everything accepted by pyproj.CRS.from_user_input(), e.g. "EPSG:4326"
    value: str

    @classmethod
    def from_str(cls, crs: str):
        try:
            pyproj.CRS.from_user_input(crs)
            return cls(value=crs)
        except Exception:
            raise ValueError('Invalid CRS')

    @classmethod
    def from_epsg(cls, epsg: int):
        return cls(value=f'EPSG:{epsg}')

    @classmethod
    def from_value(cls, crs: str):
        return cls.from_str(crs)

    def to_str(self):
        return self.value

    def to_value(self):
        return self.to_str()
