# Morpheus Project Integration Tests

This directory contains integration tests for the Morpheus project management system, based on the workflows demonstrated in the Jupyter notebooks (particularly `RioPrimeroWithCommands.ipynb`).

## ⚠️ Prerequisites

**These are integration tests that require MongoDB to be running.**

Before running tests:

```bash
# Start MongoDB and other dev services
cd /Users/ralf/Projects/inowas/morpheus/src/backend
make start-dev

# Or start only MongoDB
cd /Users/ralf/Projects/inowas/morpheus/infrastructure/local
docker-compose up -d mongodb_backend
```

**Note**: Tests use a separate database (`morpheus_test`) to avoid interfering with your development data in the `morpheus` database.

## Test Structure

### Test Files

- **`test_project_commands.py`** - Tests for project creation and management commands
  - Creating projects with various configurations
  - Project metadata validation

- **`test_model_commands.py`** - Tests for model creation and time discretization
  - Creating models with different grid configurations
  - Updating time discretization with various stress periods
  - Testing different time units and multipliers

- **`test_layer_commands.py`** - Tests for layer management commands
  - Creating layers with different confinement types
  - Deleting layers
  - Updating layer metadata (name, description)
  - Updating layer property default values
  - Applying spatial zones to layer properties

- **`test_rio_primero_workflow.py`** - Complete end-to-end workflow test
  - Replicates the full RioPrimeroWithCommands notebook workflow
  - Tests the complete sequence from project creation to layer property zones
  - Validates state changes at each step

### Fixtures (`conftest.py`)

Common fixtures are defined in `src/tests/conftest.py`:

- `user_id` - Test user ID
- `project_id` - Test project ID
- `model_id` - Test model ID
- `layer_id` - Test layer ID
- `test_polygon` - Standard test polygon for spatial operations
- `command_bus` - Project command bus for dispatching commands
- `model_reader` - Model reader for verifying state changes

## Running the Tests

### Using Make Commands (Recommended)

```bash
cd /Users/ralf/Projects/inowas/morpheus/src/backend

# Run all integration tests
make run-integration-tests

# Run with coverage report
make run-integration-tests-coverage

# Run only the workflow test
make run-workflow-test
```

### Run All Tests

```bash
cd /Users/ralf/Projects/inowas/morpheus/src/backend
pytest
```

### Run Specific Test File

```bash
# Run project command tests
pytest src/tests/morpheus/project/test_project_commands.py

# Run model command tests
pytest src/tests/morpheus/project/test_model_commands.py

# Run layer command tests
pytest src/tests/morpheus/project/test_layer_commands.py

# Run the complete workflow test
pytest src/tests/morpheus/project/test_rio_primero_workflow.py
```

### Run Specific Test Class or Method

```bash
# Run a specific test class
pytest src/tests/morpheus/project/test_layer_commands.py::TestCreateModelLayerCommand

# Run a specific test method
pytest src/tests/morpheus/project/test_layer_commands.py::TestCreateModelLayerCommand::test_create_top_layer_convertible
```

### Run with Verbose Output

```bash
pytest -v
```

### Run with Coverage

```bash
pytest --cov=morpheus --cov-report=html
```

## Test Patterns

### Command-Based Testing

These integration tests follow a command-based testing pattern:

1. **Arrange** - Set up test data and commands
2. **Act** - Dispatch commands via the command bus
3. **Assert** - Verify state changes using the model reader

Example:

```python
def test_create_project(self, user_id, project_id, command_bus):
    # Arrange
    command = CreateProjectCommand(
        project_id=project_id,
        name=Name('Test Project'),
        description=Description('Test description'),
        tags=Tags.from_list(['test']),
        user_id=user_id
    )

    # Act
    command_bus.dispatch(command)

    # Assert
    # Verify project was created (using reader if needed)
```

### Fixture-Based Setup

Tests use pytest fixtures for common setup:

```python
@pytest.fixture(autouse=True)
def setup_project(self, user_id, project_id, command_bus):
    """Create a project before each test."""
    command = CreateProjectCommand(...)
    command_bus.dispatch(command)
```

### State Verification

Tests verify state changes using the `ModelReader`:

```python
model = self.model_reader.get_latest_model(self.project_id)
assert model.layers[-1].name.value == 'Bottom Layer'
```

## Test Coverage

The tests cover the following command workflows:

### Project Commands
- ✅ CreateProjectCommand
- ⏳ UpdateProjectMetadataCommand (TODO)
- ⏳ DeleteProjectCommand (TODO)

### Model Commands
- ✅ CreateModelCommand
- ✅ UpdateModelTimeDiscretizationCommand

### Layer Commands
- ✅ CreateModelLayerCommand
- ✅ DeleteModelLayerCommand
- ✅ UpdateModelLayerMetadataCommand
- ✅ UpdateModelLayerPropertyDefaultValueCommand
- ✅ UpdateModelLayerPropertyZonesCommand

### Boundary Commands
- ⏳ TODO - Add tests for boundary creation and management

### Calculation Commands
- ⏳ TODO - Add tests for calculation workflows

## Dependencies

The tests require:

- `pytest==8.4.2` - Testing framework
- Access to the command bus and repositories
- MongoDB (if testing against real database)

## Notes

- Tests currently use the real command bus and repositories
- Some tests may require a running MongoDB instance
- Consider adding database fixtures for isolated testing
- Add cleanup fixtures if tests leave state in the database

## Future Improvements

1. **Database Isolation**
   - Add cleanup fixtures to remove test data after each test
   - Use unique database names or transactions for test isolation

2. **Test Coverage**
   - Add tests for boundary commands (wells, recharge, rivers, etc.)
   - Add tests for calculation workflows
   - Add tests for error cases and validation
   - Test boundary conditions and edge cases

3. **Unit Tests**
   - Create separate unit tests with mocked repositories
   - Test business logic without MongoDB dependency
   - Faster feedback during development

4. **Performance**
   - Add performance benchmarks
   - Monitor test execution time
   - Enable parallel test execution with proper isolation

5. **Documentation**
   - Add docstrings to all test methods
   - Document expected behavior and edge cases
