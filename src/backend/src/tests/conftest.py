import os
import sys

import pytest

# Set environment to testing before importing morpheus modules.
os.environ.setdefault('FLASK_ENV', 'testing')
os.environ.setdefault('BACKEND_SECRET_KEY', 'test-secret-key-for-pytest')
os.environ.setdefault('BACKEND_MAX_CONTENT_LENGTH', '104857600')
os.environ.setdefault('BACKEND_KEYCLOAK_CLIENT_ID', 'test-client')
os.environ.setdefault('BACKEND_KEYCLOAK_CLIENT_SECRET', 'test-secret')
os.environ.setdefault('BACKEND_KEYCLOAK_REALM', 'test-realm')
os.environ.setdefault('BACKEND_KEYCLOAK_SERVER_URL', 'http://localhost:8080')
os.environ.setdefault('BACKEND_KEYCLOAK_MORPHEUS_ADMIN_ROLE', 'morpheus_admin')
os.environ.setdefault('BACKEND_MONGO_HOST', 'localhost')
os.environ.setdefault('BACKEND_MONGO_PORT', '27017')
os.environ.setdefault('BACKEND_MONGO_USER', 'dev')
os.environ.setdefault('BACKEND_MONGO_PASSWORD', 'dev')
os.environ.setdefault('BACKEND_MONGO_INITDB_ROOT_USERNAME', 'root')
os.environ.setdefault('BACKEND_MONGO_INITDB_ROOT_PASSWORD', 'dev-root')
os.environ.setdefault('BACKEND_MONGO_PROJECT_DATABASE', 'morpheus_test_project')
os.environ.setdefault('BACKEND_MONGO_SENSOR_DATABASE', 'morpheus_test_sensor')
os.environ.setdefault('BACKEND_MONGO_USER_DATABASE', 'morpheus_test_user')
os.environ.setdefault('BACKEND_MORPHEUS_PROJECT_ASSET_DATA', '/tmp/test/assets')
os.environ.setdefault('BACKEND_MORPHEUS_PROJECT_CALCULATION_DATA', '/tmp/test/calculations')
os.environ.setdefault('BACKEND_MORPHEUS_SENSOR_LOCAL_DATA', '/tmp/test/sensors')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_HOST', 'localhost')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_USER', 'test')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_PASSWORD', 'test')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_PATH', '/test')
os.environ.setdefault('BACKEND_CELERY_BROKER', 'redis://localhost:6379/0')
os.environ.setdefault('BACKEND_CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')


def _prepare_test_database_users():
    from pymongo import MongoClient
    from pymongo.errors import OperationFailure

    client = MongoClient(
        host=os.environ['BACKEND_MONGO_HOST'],
        port=int(os.environ['BACKEND_MONGO_PORT']),
        username=os.environ['BACKEND_MONGO_INITDB_ROOT_USERNAME'],
        password=os.environ['BACKEND_MONGO_INITDB_ROOT_PASSWORD'],
        authSource='admin',
    )
    try:
        client.admin.command('ping')
        for database_name in (
            os.environ['BACKEND_MONGO_PROJECT_DATABASE'],
            os.environ['BACKEND_MONGO_SENSOR_DATABASE'],
            os.environ['BACKEND_MONGO_USER_DATABASE'],
        ):
            try:
                client[database_name].command(
                    'createUser',
                    os.environ['BACKEND_MONGO_USER'],
                    pwd=os.environ['BACKEND_MONGO_PASSWORD'],
                    roles=['readWrite'],
                )
            except OperationFailure as exception:
                if exception.code != 51003:  # UserAlreadyExists
                    raise
    finally:
        client.close()


_prepare_test_database_users()

try:
    from morpheus.common.types.identity.Identity import UserId
    from morpheus.project.application.read.ModelReader import ModelReader
    from morpheus.project.application.write import project_command_bus
    from morpheus.project.types.geometry import Polygon
    from morpheus.project.types.layers.Layer import LayerId
    from morpheus.project.types.Model import ModelId
    from morpheus.project.types.Project import ProjectId
except Exception as exception:
    print('\n' + '=' * 80, file=sys.stderr)
    print('ERROR: Cannot import Morpheus modules. MongoDB must be running!', file=sys.stderr)
    print('=' * 80, file=sys.stderr)
    print('\nStart MongoDB with: cd src/backend && make start-dev', file=sys.stderr)
    print(f'\nError details: {type(exception).__name__}: {exception}', file=sys.stderr)
    print('=' * 80 + '\n', file=sys.stderr)
    sys.exit(1)


@pytest.fixture
def user_id() -> UserId:
    return UserId.new()


@pytest.fixture
def project_id() -> ProjectId:
    return ProjectId.new()


@pytest.fixture
def model_id() -> ModelId:
    return ModelId.new()


@pytest.fixture
def layer_id() -> LayerId:
    return LayerId.new()


@pytest.fixture
def test_polygon() -> Polygon:
    return Polygon(
        type='Polygon',
        coordinates=[
            [
                (13.922514437551428, 50.964720483303836),
                (13.925250781947113, 50.965228748412386),
                (13.925036413951403, 50.96623732041704),
                (13.92222441026388, 50.96629040370362),
                (13.922514437551428, 50.964720483303836),
            ]
        ],
    )


@pytest.fixture
def command_bus():
    return project_command_bus


@pytest.fixture
def model_reader():
    return ModelReader()


@pytest.fixture(autouse=True)
def clean_test_databases():
    """Clean only databases configured for tests before and after each test."""
    from pymongo import MongoClient

    from morpheus.settings import settings

    database_names = {
        settings.MONGO_PROJECT_DATABASE,
        settings.MONGO_SENSOR_DATABASE,
        settings.MONGO_USER_DATABASE,
    }
    clients = [
        MongoClient(
            host=settings.MONGO_HOST,
            port=settings.MONGO_PORT,
            username=settings.MONGO_USER,
            password=settings.MONGO_PASSWORD,
            authSource=database_name,
        )
        for database_name in database_names
    ]
    databases = [client[database_name] for client, database_name in zip(clients, database_names, strict=True)]

    def clear():
        for database in databases:
            for collection_name in database.list_collection_names():
                database[collection_name].delete_many({})

    clear()
    try:
        yield
    finally:
        clear()
        for client in clients:
            client.close()


@pytest.fixture
def setup_project(user_id, project_id, command_bus):
    from morpheus.project.application.write.Project import CreateProjectCommand
    from morpheus.project.types.Project import Description, Name, Tags

    command_bus.dispatch(
        CreateProjectCommand(
            project_id=project_id,
            name=Name('Test Project'),
            description=Description('Test project'),
            tags=Tags.from_list(['test']),
            user_id=user_id,
        )
    )
    return project_id


@pytest.fixture
def setup_model(setup_project, user_id, model_id, test_polygon, command_bus):
    from morpheus.project.application.write.Model.General import CreateModelCommand
    from morpheus.project.types.discretization.spatial import Rotation

    command_bus.dispatch(
        CreateModelCommand(
            project_id=setup_project,
            user_id=user_id,
            model_id=model_id,
            geometry=test_polygon,
            n_cols=10,
            n_rows=10,
            rotation=Rotation.from_float(0.0),
        )
    )
    return {'project_id': setup_project, 'model_id': model_id}


@pytest.fixture
def setup_full_model(setup_model, user_id, command_bus):
    from morpheus.project.application.write.Model.Layers import CreateModelLayerCommand
    from morpheus.project.types.layers.Layer import LayerConfinement, LayerDescription, LayerId, LayerName, LayerProperties

    project_id = setup_model['project_id']
    model_id = setup_model['model_id']
    layer_ids = []

    for name, confinement, top, bottom in [
        ('Top Layer', LayerConfinement.convertible(), 460, 450),
        ('Aquitard', LayerConfinement.confined(), 450, 448),
        ('Bottom Aquifer', LayerConfinement.confined(), 448, 390),
    ]:
        layer_id = LayerId.new()
        command_bus.dispatch(
            CreateModelLayerCommand(
                project_id=project_id,
                model_id=model_id,
                user_id=user_id,
                layer_id=layer_id,
                name=LayerName(name),
                confinement=confinement,
                description=LayerDescription(name),
                properties=LayerProperties.from_values(
                    top=top,
                    bottom=bottom,
                    initial_head=top,
                    hk=8.64,
                    hani=1,
                    vka=0.864,
                    specific_storage=1e-5,
                    specific_yield=0.2,
                ),
            )
        )
        layer_ids.append(layer_id)

    return {'project_id': project_id, 'model_id': model_id, 'layer_ids': layer_ids}


@pytest.fixture
def boundary_context(setup_model, user_id, command_bus, model_reader):
    from morpheus.project.application.write.Model.Boundaries import AddModelBoundaryCommand
    from morpheus.project.types.boundaries.Boundary import BoundaryId, BoundaryName, BoundaryTags, BoundaryType
    from morpheus.project.types.geometry import Point

    project_id = setup_model['project_id']
    model_id = setup_model['model_id']
    boundary_id = BoundaryId.new()
    command_bus.dispatch(
        AddModelBoundaryCommand(
            project_id=project_id,
            model_id=model_id,
            boundary_id=boundary_id,
            type=BoundaryType.well,
            name=BoundaryName('Test Well'),
            tags=BoundaryTags.from_list(['initial']),
            geometry=Point(coordinates=(13.9235, 50.9655)),
            user_id=user_id,
        )
    )
    return {
        'project_id': project_id,
        'model_id': model_id,
        'boundary_id': boundary_id,
        'user_id': user_id,
        'model_reader': model_reader,
    }
