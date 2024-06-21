from flask import Request, abort, Response

from morpheus.common.types.Exceptions import NotFoundException, InsufficientPermissionsException
from ....application.write import project_command_bus
from ....application.write.CommandFactory import command_factory
from ....application.write.Calculation import AddCalculationProfileCommand, StartCalculationCommand
from ....application.write.Model import AddModelBoundaryCommand, AddModelBoundaryObservationCommand, CloneModelBoundaryCommand
from ....application.write.Model.CloneModelLayer import CloneModelLayerCommand
from ....application.write.Model.CreateModel import CreateModelCommand
from ....application.write.Model.CreateModelLayer import CreateModelLayerCommand
from ....application.write.Model.CreateModelVersion import CreateModelVersionCommand
from ....application.write.Project import CreateProjectCommand
from ....incoming import get_identity


class MessageBoxRequestHandler:
    @staticmethod
    def handle(request: Request):
        if not request.is_json:
            abort(400, 'Request body must be JSON')

        identity = get_identity()
        if identity is None:
            abort(401, 'Unauthorized')
        user_id = identity.user_id

        # for the sake of simplicity, we make the mapping between the request path and the command explicit here
        body = request.json
        if body is None:
            abort(400, 'Missing body')

        try:
            command = command_factory.create_from_request_body(user_id=user_id, body=body)  # type: ignore
        except ValueError as e:
            abort(400, str(e))

        try:
            project_command_bus.dispatch(command)

            if isinstance(command, CreateProjectCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}'})

            if isinstance(command, AddCalculationProfileCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/calculation-profiles/{command.calculation_profile.id.to_str()}'})

            if isinstance(command, CreateModelCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model'})

            if isinstance(command, CreateModelVersionCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/versions/{command.version_tag.to_str()}'})

            if isinstance(command, CreateModelLayerCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/layers/{command.layer_id.to_str()}'})

            if isinstance(command, CloneModelLayerCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/layers/{command.new_layer_id.to_str()}'})

            if isinstance(command, AddModelBoundaryCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/boundaries/{command.boundary_id.to_str()}'})

            if isinstance(command, CloneModelBoundaryCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/model/boundaries/{command.new_boundary_id.to_str()}'})

            if isinstance(command, StartCalculationCommand):
                return Response(status=201, headers={'location': f'projects/{command.project_id.to_str()}/calculations/{command.new_calculation_id.to_str()}'})

            if isinstance(command, AddModelBoundaryObservationCommand):
                return Response(
                    status=201,
                    headers={
                        'location': f'projects/{command.project_id.to_str()}/model/boundaries/{command.boundary_id.to_str()}/observations/{command.observation_id.to_str()}'
                    }
                )

            return Response(status=204)

        except NotFoundException as e:
            abort(404, str(e))
        except InsufficientPermissionsException as e:
            abort(403, str(e))
        except Exception as e:
            abort(500, str(e))
