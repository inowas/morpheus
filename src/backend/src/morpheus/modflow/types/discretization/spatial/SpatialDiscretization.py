import dataclasses
from ...geometry import Polygon, Point
from . import Crs, Grid, GridCells, Rotation


@dataclasses.dataclass(frozen=True)
class SpatialDiscretization:
    geometry: Polygon
    grid: Grid
    affected_cells: GridCells | None
    crs: Crs = Crs.from_str('EPSG:4326')

    @classmethod
    def new(cls):
        polygon = Polygon(coordinates=[[(0, 0), (1, 0), (1, 1), (0, 1), (0, 0)]])
        return cls(
            geometry=polygon,
            affected_cells=GridCells.empty_from_shape(nx=1, ny=1),
            grid=Grid.from_polygon_with_relative_coordinates(polygon=polygon, rotation=Rotation.from_float(0),
                                                             x_coordinates=[0, 1], y_coordinates=[0, 1]),
            crs=Crs.from_str('EPSG:4326')
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            geometry=Polygon.from_dict(obj['geometry']),
            affected_cells=GridCells.from_dict(obj['affected_cells'] if obj.get('affected_cells') else None),
            grid=Grid.from_dict(obj['grid']),
            crs=Crs.from_value(obj['crs'] if obj.get('crs') else 'EPSG:4326')
        )

    def to_dict(self):
        return {
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict() if self.affected_cells else None,
            'grid': self.grid.to_dict(),
            'crs': self.crs.to_value()
        }

    def with_geometry(self, geometry: Polygon):
        return dataclasses.replace(self, geometry=geometry)

    def with_grid(self, grid: Grid):
        return dataclasses.replace(self, grid=grid)

    def with_affected_cells(self, affected_cells: GridCells):
        return dataclasses.replace(self, affected_cells=affected_cells)

    def with_crs(self, crs: Crs):
        return dataclasses.replace(self, crs=crs)
