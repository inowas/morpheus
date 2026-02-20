import dataclasses

from morpheus.common.types.Exceptions import InsufficientPermissionsException

from ....application.read.ModelReader import ModelReader
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....infrastructure.persistence.ModelRepository import ModelNotFoundException
from ....types.discretization import SpatialDiscretization
from ....types.permissions.Privilege import Privilege
from ....types.Project import ProjectId


@dataclasses.dataclass(frozen=True)
class SpatialDiscretizationResponseObject:
    spatial_discretization: SpatialDiscretization

    @classmethod
    def from_spatial_discretization(cls, spatial_discretization):
        return cls(spatial_discretization=spatial_discretization)

    def serialize(self):
        return {
            'affected_cells': self.spatial_discretization.affected_cells.to_dict(),
            'geometry': self.spatial_discretization.geometry.as_geojson(),
            'grid': {
                'n_cols': self.spatial_discretization.grid.n_cols(),
                'n_rows': self.spatial_discretization.grid.n_rows(),
                'col_widths': [round(width, 3) for width in self.spatial_discretization.grid.col_widths],
                'row_heights': [round(height, 3) for height in self.spatial_discretization.grid.row_heights],
                'length_unit': self.spatial_discretization.grid.length_unit.to_value(),
                'origin': self.spatial_discretization.grid.origin.to_dict(),
                'rotation': self.spatial_discretization.grid.rotation.to_value(),
                'outline': self.spatial_discretization.grid.get_wgs_outline_geometry().geometry.to_dict(),
            },
        }


class ReadModelSpatialDiscretizationRequestHandler:
    def handle(self, project_id: ProjectId):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)
        except InsufficientPermissionsException as e:
            return str(e), 403
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404

        spatial_discretization = model.spatial_discretization

        if spatial_discretization is None:
            return {'message': 'Spatial discretization not found'}, 404

        result = SpatialDiscretizationResponseObject.from_spatial_discretization(spatial_discretization=spatial_discretization)
        return result.serialize(), 200
