import os
import sys

import pytest

# Set environment to testing before importing morpheus modules
os.environ.setdefault('FLASK_ENV', 'testing')
os.environ.setdefault('BACKEND_SECRET_KEY', 'test-secret-key-for-pytest')
os.environ.setdefault('BACKEND_MAX_CONTENT_LENGTH', '104857600')  # 100MB
os.environ.setdefault('BACKEND_KEYCLOAK_CLIENT_ID', 'test-client')
os.environ.setdefault('BACKEND_KEYCLOAK_CLIENT_SECRET', 'test-secret')
os.environ.setdefault('BACKEND_KEYCLOAK_REALM', 'test-realm')
os.environ.setdefault('BACKEND_KEYCLOAK_SERVER_URL', 'http://localhost:8080')
os.environ.setdefault('BACKEND_KEYCLOAK_MORPHEUS_ADMIN_ROLE', 'morpheus_admin')
os.environ.setdefault('BACKEND_MONGO_HOST', 'localhost')
os.environ.setdefault('BACKEND_MONGO_PORT', '27017')
os.environ.setdefault('BACKEND_MONGO_USER', 'dev')
os.environ.setdefault('BACKEND_MONGO_PASSWORD', 'dev')
# Use separate test database to avoid interfering with development data
os.environ.setdefault('BACKEND_MONGO_DATABASE', 'morpheus_test')
os.environ.setdefault('BACKEND_MORPHEUS_PROJECT_ASSET_DATA', '/tmp/test/assets')
os.environ.setdefault('BACKEND_MORPHEUS_PROJECT_CALCULATION_DATA', '/tmp/test/calculations')
os.environ.setdefault('BACKEND_MORPHEUS_SENSOR_LOCAL_DATA', '/tmp/test/sensors')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_HOST', 'localhost')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_USER', 'test')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_PASSWORD', 'test')
os.environ.setdefault('BACKEND_MORPHEUS_SENSORS_UIT_FTP_PATH', '/test')
os.environ.setdefault('BACKEND_CELERY_BROKER', 'redis://localhost:6379/0')
os.environ.setdefault('BACKEND_CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

# Try to import morpheus modules - will fail if MongoDB is not available
try:
    from morpheus.common.types.identity.Identity import UserId
    from morpheus.project.application.read.ModelReader import ModelReader
    from morpheus.project.application.write import project_command_bus
    from morpheus.project.types.geometry import Polygon
    from morpheus.project.types.layers.Layer import LayerId
    from morpheus.project.types.Model import ModelId
    from morpheus.project.types.Project import ProjectId
except Exception as e:
    print('\n' + '=' * 80, file=sys.stderr)
    print('ERROR: Cannot import Morpheus modules. MongoDB must be running!', file=sys.stderr)
    print('=' * 80, file=sys.stderr)
    print('\nThese integration tests require a running MongoDB instance.', file=sys.stderr)
    print('\nTo start MongoDB:', file=sys.stderr)
    print('  cd /Users/ralf/Projects/inowas/morpheus/src/backend', file=sys.stderr)
    print('  make start-dev', file=sys.stderr)
    print('\nOr using Docker directly:', file=sys.stderr)
    print('  cd /Users/ralf/Projects/inowas/morpheus/infrastructure/local', file=sys.stderr)
    print('  docker-compose up -d mongodb_backend', file=sys.stderr)
    print('\nError details:', file=sys.stderr)
    print(f'  {type(e).__name__}: {e}', file=sys.stderr)
    print('=' * 80 + '\n', file=sys.stderr)
    sys.exit(1)


@pytest.fixture
def user_id() -> UserId:
    """Fixture providing a test user ID."""
    return UserId.new()


@pytest.fixture
def project_id() -> ProjectId:
    """Fixture providing a test project ID."""
    return ProjectId.new()


@pytest.fixture
def model_id() -> ModelId:
    """Fixture providing a test model ID."""
    return ModelId.new()


@pytest.fixture
def layer_id() -> LayerId:
    """Fixture providing a test layer ID."""
    return LayerId.new()


@pytest.fixture
def test_polygon() -> Polygon:
    """Fixture providing a test polygon for spatial operations."""
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
    """Fixture providing the project command bus."""
    return project_command_bus


@pytest.fixture
def model_reader():
    """Fixture providing the model reader for verification."""
    return ModelReader()
