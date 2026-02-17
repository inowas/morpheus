"""Integration tests for Layer commands.

These tests verify layer creation, deletion, and property updates,
following the patterns from the RioPrimeroWithCommands notebook.
"""
import pytest

from morpheus.project.types.Project import Name, Description, Tags
from morpheus.project.types.discretization.spatial import Rotation
from morpheus.project.types.layers.Layer import (
    LayerId, LayerName, LayerProperties, LayerDescription,
    LayerConfinement, LayerPropertyName, LayerPropertyDefaultValue
)
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.geometry.MultiPolygon import MultiPolygon
from morpheus.project.application.write.Project import CreateProjectCommand
from morpheus.project.application.write.Model.General import CreateModelCommand
from morpheus.project.application.write.Model.Layers import (
    CreateModelLayerCommand,
    DeleteModelLayerCommand,
    UpdateModelLayerMetadataCommand,
    UpdateModelLayerPropertyDefaultValueCommand,
)
from morpheus.project.application.write.Model.Layers.UpdateModelLayerPropertyZones import (
    LayerPropertyZoneWithOptionalAffectedCells,
    UpdateModelLayerPropertyZonesCommand
)

pytestmark = [pytest.mark.integration, pytest.mark.layer]


@pytest.fixture
def setup_project_and_model(user_id, project_id, model_id, test_polygon, command_bus):
    """Fixture that creates a project and model for layer tests."""
    # Create project
    create_project_command = CreateProjectCommand(
        project_id=project_id,
        name=Name('Test Project for Layers'),
        description=Description('Test project'),
        tags=Tags.from_list(['test', 'layers']),
        user_id=user_id
    )
    command_bus.dispatch(create_project_command)

    # Create model
    create_model_command = CreateModelCommand(
        project_id=project_id,
        user_id=user_id,
        model_id=model_id,
        geometry=test_polygon,
        n_cols=100,
        n_rows=50,
        rotation=Rotation.from_float(0.0),
    )
    command_bus.dispatch(create_model_command)

    return {'project_id': project_id, 'model_id': model_id, 'user_id': user_id}


class TestCreateModelLayerCommand:
    """Tests for CreateModelLayerCommand."""

    @pytest.fixture(autouse=True)
    def setup(self, setup_project_and_model):
        """Setup project and model before each test."""
        self.project_id = setup_project_and_model['project_id']
        self.model_id = setup_project_and_model['model_id']
        self.user_id = setup_project_and_model['user_id']

    def test_create_top_layer_convertible(self, command_bus):
        """Test creating a convertible top layer."""
        # Arrange
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=LayerId.new(),
            name=LayerName('Top Layer'),
            confinement=LayerConfinement.convertible(),
            description=LayerDescription('Top aquifer layer'),
            properties=LayerProperties.from_values(
                top=460,
                bottom=450,
                initial_head=460,
                hk=8.64,
                hani=1,
                vka=0.864,
                specific_storage=1e-5,
                specific_yield=0.2
            )
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_create_aquitard_layer_confined(self, command_bus):
        """Test creating a confined aquitard layer."""
        # Arrange
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=LayerId.new(),
            name=LayerName('Aquitard'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Low permeability layer'),
            properties=LayerProperties.from_values(
                top=450.0,
                bottom=448.0,
                initial_head=450.0,
                hk=10,
                hani=1,
                vka=0.1,
                specific_storage=1e-5,
                specific_yield=0.2,
            )
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_create_aquifer_layer_confined(self, command_bus):
        """Test creating a confined aquifer layer."""
        # Arrange
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=LayerId.new(),
            name=LayerName('Deep Aquifer'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Deep confined aquifer'),
            properties=LayerProperties.from_values(
                top=448,
                bottom=390,
                initial_head=448,
                hk=8.64,
                hani=1,
                vka=0.864,
                specific_storage=1e-5,
                specific_yield=0.2,
            )
        )

        # Act
        command_bus.dispatch(command)

        # Assert
        assert True

    def test_create_multiple_layers(self, command_bus):
        """Test creating multiple layers in sequence."""
        # Arrange - create three layers
        layers = [
            ('Top Layer', LayerConfinement.convertible(), 460, 450),
            ('Aquitard', LayerConfinement.confined(), 450, 448),
            ('Bottom Aquifer', LayerConfinement.confined(), 448, 390),
        ]

        # Act
        for name, confinement, top, bottom in layers:
            command = CreateModelLayerCommand(
                project_id=self.project_id,
                model_id=self.model_id,
                user_id=self.user_id,
                layer_id=LayerId.new(),
                name=LayerName(name),
                confinement=confinement,
                description=LayerDescription(f'{name} description'),
                properties=LayerProperties.from_values(
                    top=top,
                    bottom=bottom,
                    initial_head=top,
                    hk=8.64,
                    hani=1,
                    vka=0.864,
                    specific_storage=1e-5,
                    specific_yield=0.2,
                )
            )
            command_bus.dispatch(command)

        # Assert
        assert True


class TestDeleteModelLayerCommand:
    """Tests for DeleteModelLayerCommand."""

    @pytest.fixture(autouse=True)
    def setup(self, setup_project_and_model, command_bus, model_reader):
        """Setup project, model, and layers before each test."""
        self.project_id = setup_project_and_model['project_id']
        self.model_id = setup_project_and_model['model_id']
        self.user_id = setup_project_and_model['user_id']
        self.model_reader = model_reader
        self.command_bus = command_bus

        # Create a test layer that can be deleted
        self.test_layer_id = LayerId.new()
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            name=LayerName('Layer to Delete'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('This layer will be deleted'),
            properties=LayerProperties.from_values(
                top=100,
                bottom=50,
                initial_head=100,
                hk=1.0,
                hani=1,
                vka=0.1,
                specific_storage=1e-5,
                specific_yield=0.2,
            )
        )
        command_bus.dispatch(command)

    def test_delete_layer(self):
        """Test deleting a layer."""
        # Arrange
        command = DeleteModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert
        assert True

    def test_delete_default_layer(self):
        """Test deleting the default layer (as shown in the notebook)."""
        # Arrange - get the default layer from the model
        model = self.model_reader.get_latest_model(self.project_id)
        layers = model.layers

        # Find the default layer (typically the first one)
        default_layer_id = layers[0].layer_id

        command = DeleteModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=default_layer_id
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert
        assert True


class TestUpdateModelLayerMetadataCommand:
    """Tests for UpdateModelLayerMetadataCommand."""

    @pytest.fixture(autouse=True)
    def setup(self, setup_project_and_model, command_bus, model_reader):
        """Setup project, model, and layers before each test."""
        self.project_id = setup_project_and_model['project_id']
        self.model_id = setup_project_and_model['model_id']
        self.user_id = setup_project_and_model['user_id']
        self.model_reader = model_reader
        self.command_bus = command_bus

        # Create a test layer
        self.test_layer_id = LayerId.new()
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            name=LayerName('Original Name'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Original description'),
            properties=LayerProperties.from_values(
                top=100,
                bottom=50,
                initial_head=100,
                hk=1.0,
                hani=1,
                vka=0.1,
                specific_storage=1e-5,
                specific_yield=0.2,
            )
        )
        command_bus.dispatch(command)

    def test_update_layer_name_and_description(self):
        """Test updating layer name and description."""
        # Arrange
        command = UpdateModelLayerMetadataCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            layer_name=LayerName('Updated Layer Name'),
            layer_description=LayerDescription('Updated description'),
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert - verify the change
        model = self.model_reader.get_latest_model(self.project_id)
        updated_layer = next(
            (layer for layer in model.layers if layer.layer_id == self.test_layer_id),
            None
        )
        assert updated_layer is not None
        assert updated_layer.name.value == 'Updated Layer Name'
        assert updated_layer.description.value == 'Updated description'

    def test_update_bottom_layer_metadata(self):
        """Test updating the bottom layer metadata (as shown in notebook)."""
        # Arrange - get the bottom layer
        model = self.model_reader.get_latest_model(self.project_id)
        layers = model.layers
        bottom_layer_id = layers[-1].layer_id

        command = UpdateModelLayerMetadataCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=bottom_layer_id,
            layer_name=LayerName('Bottom Layer'),
            layer_description=LayerDescription('Bottom Layer'),
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert - verify the change
        model = self.model_reader.get_latest_model(self.project_id)
        assert model.layers[-1].name.value == 'Bottom Layer'
        assert model.layers[-1].description.value == 'Bottom Layer'


class TestUpdateModelLayerPropertyDefaultValueCommand:
    """Tests for UpdateModelLayerPropertyDefaultValueCommand."""

    @pytest.fixture(autouse=True)
    def setup(self, setup_project_and_model, command_bus, model_reader):
        """Setup project, model, and layers before each test."""
        self.project_id = setup_project_and_model['project_id']
        self.model_id = setup_project_and_model['model_id']
        self.user_id = setup_project_and_model['user_id']
        self.model_reader = model_reader
        self.command_bus = command_bus

        # Create a test layer
        self.test_layer_id = LayerId.new()
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            name=LayerName('Test Layer'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Test layer'),
            properties=LayerProperties.from_values(
                top=100,
                bottom=50,
                initial_head=100,
                hk=1.0,
                hani=1,
                vka=0.1,
                specific_storage=1e-5,
                specific_yield=0.2,
            )
        )
        command_bus.dispatch(command)

    def test_update_hydraulic_conductivity(self):
        """Test updating hydraulic conductivity (hk) property."""
        # Arrange
        command = UpdateModelLayerPropertyDefaultValueCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            property_name=LayerPropertyName.from_value('hk'),
            property_default_value=LayerPropertyDefaultValue.from_value(8.64),
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert - verify the change
        model = self.model_reader.get_latest_model(self.project_id)
        test_layer = next(
            (layer for layer in model.layers if layer.layer_id == self.test_layer_id),
            None
        )
        assert test_layer is not None
        assert test_layer.properties.hk.value.value == 8.64

    def test_update_vertical_conductivity(self):
        """Test updating vertical hydraulic conductivity (vka) property."""
        # Arrange
        command = UpdateModelLayerPropertyDefaultValueCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            property_name=LayerPropertyName.from_value('vka'),
            property_default_value=LayerPropertyDefaultValue.from_value(0.5),
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert - verify the change
        model = self.model_reader.get_latest_model(self.project_id)
        test_layer = next(
            (layer for layer in model.layers if layer.layer_id == self.test_layer_id),
            None
        )
        assert test_layer is not None
        assert test_layer.properties.vka.value.value == 0.5

    def test_update_specific_storage(self):
        """Test updating specific storage property."""
        # Arrange
        command = UpdateModelLayerPropertyDefaultValueCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            property_name=LayerPropertyName.from_value('specific_storage'),
            property_default_value=LayerPropertyDefaultValue.from_value(1e-4),
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert - verify the change
        model = self.model_reader.get_latest_model(self.project_id)
        test_layer = next(
            (layer for layer in model.layers if layer.layer_id == self.test_layer_id),
            None
        )
        assert test_layer is not None
        assert test_layer.properties.specific_storage.value.value == 1e-4


class TestUpdateModelLayerPropertyZonesCommand:
    """Tests for UpdateModelLayerPropertyZonesCommand."""

    @pytest.fixture(autouse=True)
    def setup(self, setup_project_and_model, command_bus, model_reader):
        """Setup project, model, and layers before each test."""
        self.project_id = setup_project_and_model['project_id']
        self.model_id = setup_project_and_model['model_id']
        self.user_id = setup_project_and_model['user_id']
        self.model_reader = model_reader
        self.command_bus = command_bus

        # Create a test layer
        self.test_layer_id = LayerId.new()
        command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            name=LayerName('Test Layer with Zones'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Test layer for zoning'),
            properties=LayerProperties.from_values(
                top=100,
                bottom=50,
                initial_head=100,
                hk=1.0,
                hani=1,
                vka=0.1,
                specific_storage=1e-5,
                specific_yield=0.2,
            )
        )
        command_bus.dispatch(command)

    def test_update_property_with_zones(self):
        """Test updating layer property with zones (as shown in notebook)."""
        # Arrange
        bottom_left_top_right_polygons = MultiPolygon(
            type='MultiPolygon',
            coordinates=[
                [[
                    (13.92223, 50.9647),
                    (13.92223, 50.9650),
                    (13.92400, 50.9650),
                    (13.92400, 50.9647),
                    (13.92223, 50.9647)
                ]],
                [[
                    (13.924, 50.965),
                    (13.924, 50.966),
                    (13.925, 50.966),
                    (13.925, 50.965),
                    (13.924, 50.965)
                ]]
            ]
        )

        bottom_right_polygon = Polygon(
            type='Polygon',
            coordinates=[[
                (13.923, 50.965),
                (13.923, 50.966),
                (13.924, 50.966),
                (13.924, 50.965),
                (13.923, 50.965)
            ]]
        )

        zones = [
            LayerPropertyZoneWithOptionalAffectedCells.from_payload({
                'name': 'Zone 1',
                'geometry': bottom_left_top_right_polygons.to_dict(),
                'value': 5
            }),
            LayerPropertyZoneWithOptionalAffectedCells.from_payload({
                'name': 'Zone 2',
                'geometry': bottom_right_polygon.to_dict(),
                'value': 10
            })
        ]

        command = UpdateModelLayerPropertyZonesCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            property_name=LayerPropertyName.from_value('hk'),
            property_zones=zones,
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert - verify zones were applied
        model = self.model_reader.get_latest_model(self.project_id)
        test_layer = next(
            (layer for layer in model.layers if layer.layer_id == self.test_layer_id),
            None
        )
        assert test_layer is not None
        # The property should now have zones
        hk_data = test_layer.properties.hk.get_data()
        assert hk_data is not None
        # Verify data structure (could be numpy array or list)
        if hasattr(hk_data, 'shape'):
            assert len(hk_data.shape) == 2  # 2D array
        else:
            assert isinstance(hk_data, list)
            assert len(hk_data) > 0  # Has rows

    def test_update_property_with_single_zone(self):
        """Test updating layer property with a single zone."""
        # Arrange
        zone_polygon = Polygon(
            type='Polygon',
            coordinates=[[
                (13.922, 50.964),
                (13.922, 50.965),
                (13.923, 50.965),
                (13.923, 50.964),
                (13.922, 50.964)
            ]]
        )

        zones = [
            LayerPropertyZoneWithOptionalAffectedCells.from_payload({
                'name': 'High Permeability Zone',
                'geometry': zone_polygon.to_dict(),
                'value': 50.0
            })
        ]

        command = UpdateModelLayerPropertyZonesCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=self.test_layer_id,
            property_name=LayerPropertyName.from_value('hk'),
            property_zones=zones,
        )

        # Act
        self.command_bus.dispatch(command)

        # Assert
        model = self.model_reader.get_latest_model(self.project_id)
        test_layer = next(
            (layer for layer in model.layers if layer.layer_id == self.test_layer_id),
            None
        )
        assert test_layer is not None
        hk_data = test_layer.properties.hk.get_data()
        assert hk_data is not None
        # Verify data structure (could be numpy array or list)
        if hasattr(hk_data, 'shape'):
            assert len(hk_data.shape) == 2  # 2D array
        else:
            assert isinstance(hk_data, list)
            assert len(hk_data) > 0  # Has rows
