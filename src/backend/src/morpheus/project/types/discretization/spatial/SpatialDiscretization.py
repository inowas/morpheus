import dataclasses
from ...geometry import Polygon
from . import Crs, Grid, ActiveCells, Rotation


@dataclasses.dataclass
class SpatialDiscretization:
    geometry: Polygon
    grid: Grid
    affected_cells: ActiveCells

    def __init__(self, geometry: Polygon, grid: Grid, affected_cells: ActiveCells | None, crs: Crs | None = None):
        self.geometry = geometry
        self.grid = grid
        self.affected_cells = affected_cells if affected_cells is not None else ActiveCells.from_polygon(polygon=geometry, grid=grid)
        self.crs = Crs.from_epsg(4326) if crs is None else crs

    @classmethod
    def from_geometry_with_grid(cls, geometry: Polygon, grid: Grid, crs: Crs | None = None):
        return cls(
            geometry=geometry,
            grid=grid,
            affected_cells=ActiveCells.from_polygon(polygon=geometry, grid=grid),
        )

    @classmethod
    def new(cls):
        polygon = Polygon(coordinates=[[(0, 0), (1, 0), (1, 1), (0, 1), (0, 0)]])
        return cls(
            geometry=polygon,
            affected_cells=ActiveCells.empty_from_shape(n_cols=1, n_rows=1),
            grid=Grid.from_polygon_with_relative_coordinates(polygon=polygon, rotation=Rotation.from_float(0), relative_col_coordinates=[0, 1], relative_row_coordinates=[0, 1]),
        )

    @classmethod
    def from_dict(cls, obj: dict):
        return cls(
            geometry=Polygon.from_dict(obj['geometry']),
            affected_cells=ActiveCells.from_dict(obj['affected_cells']) if obj.get('affected_cells') else None,
            grid=Grid.from_dict(obj['grid']),
        )

    def to_dict(self):
        return {
            'geometry': self.geometry.to_dict(),
            'affected_cells': self.affected_cells.to_dict() if self.affected_cells else None,
            'grid': self.grid.to_dict(),
        }

    def with_updated_geometry(self, geometry: Polygon):
        return dataclasses.replace(self, geometry=geometry)

    def with_updated_grid(self, grid: Grid):
        return dataclasses.replace(self, grid=grid)

    def with_updated_affected_cells(self, affected_cells: ActiveCells):
        return dataclasses.replace(self, affected_cells=affected_cells)
