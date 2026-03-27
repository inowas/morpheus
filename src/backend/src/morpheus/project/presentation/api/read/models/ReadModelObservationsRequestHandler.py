from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.read.PermissionsReader import permissions_reader
from morpheus.project.incoming import get_identity
from morpheus.project.infrastructure.persistence.ModelRepository import ModelNotFoundException
from morpheus.project.types.observations.HeadObservation import ObservationId
from morpheus.project.types.permissions.Privilege import Privilege
from morpheus.project.types.Project import ProjectId


class ReadModelHeadObservationsRequestHandler:
    def handle(self, project_id: ProjectId, head_observation_id: ObservationId | None = None):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            model = ModelReader().get_latest_model(project_id)

            observations = model.observations
            if observations is None:
                raise NotFoundException('Boundaries not found')

            # return a single boundary if boundary_id is provided
            if head_observation_id is not None:
                head_observation = observations.get_observation(id=head_observation_id)
                if head_observation is not None:
                    return head_observation.to_dict(), 200
                raise NotFoundException(f'Boundary with id {head_observation_id.to_str()} not found')

            # return all head observations
            return observations.to_dict(), 200
        except InsufficientPermissionsException as e:
            return str(e), 403
        except ModelNotFoundException:
            return {'message': 'Model not found'}, 404
        except NotFoundException as e:
            return {'message': str(e)}, 404
