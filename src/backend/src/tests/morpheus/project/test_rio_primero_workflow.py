"""Integration test for the complete Rio Primero workflow.

This test module replicates the complete workflow from the
RioPrimeroWithCommands.ipynb notebook, testing the entire flow
from project creation through layer configuration.
"""

from datetime import datetime

import pytest

from morpheus.common.types.identity.Identity import UserId
from morpheus.project.application.read.ModelReader import ModelReader
from morpheus.project.application.write import project_command_bus
from morpheus.project.application.write.Model.Discretization import UpdateModelTimeDiscretizationCommand
from morpheus.project.application.write.Model.General import CreateModelCommand
from morpheus.project.application.write.Model.Layers import (
    CreateModelLayerCommand,
    DeleteModelLayerCommand,
    UpdateModelLayerMetadataCommand,
    UpdateModelLayerPropertyDefaultValueCommand,
)
from morpheus.project.application.write.Model.Layers.UpdateModelLayerPropertyZones import LayerPropertyZoneWithOptionalAffectedCells, UpdateModelLayerPropertyZonesCommand
from morpheus.project.application.write.Project import CreateProjectCommand
from morpheus.project.types.discretization.spatial import Rotation
from morpheus.project.types.discretization.time import TimeDiscretization
from morpheus.project.types.discretization.time.Stressperiods import (
    EndDateTime,
    IsSteadyState,
    NumberOfTimeSteps,
    StartDateTime,
    StressPeriod,
    StressPeriodCollection,
    TimeStepMultiplier,
)
from morpheus.project.types.discretization.time.TimeUnit import TimeUnit
from morpheus.project.types.geometry import Polygon
from morpheus.project.types.geometry.MultiPolygon import MultiPolygon
from morpheus.project.types.layers.Layer import LayerConfinement, LayerDescription, LayerId, LayerName, LayerProperties, LayerPropertyDefaultValue, LayerPropertyName
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import Description, Name, ProjectId, Tags

pytestmark = [pytest.mark.integration, pytest.mark.workflow, pytest.mark.slow]


class TestRioPrimeroCompleteWorkflow:
    """
    Integration test that follows the complete Rio Primero workflow
    from the RioPrimeroWithCommands notebook.
    """

    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures."""
        self.user_id = UserId.new()
        self.project_id = ProjectId.new()
        self.model_id = ModelId.new()
        self.command_bus = project_command_bus
        self.model_reader = ModelReader()

        # Test polygon (same as in notebook)
        self.polygon = Polygon(
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

    def test_complete_rio_primero_workflow(self):
        """
        Test the complete workflow from project creation to layer property zones.
        This mirrors the exact sequence from the RioPrimeroWithCommands notebook.
        """
        # Step 1: Create Project
        create_project_command = CreateProjectCommand(
            project_id=self.project_id,
            name=Name('Rio Primero Integration Test'),
            description=Description('Rio Primero Project in Argentina - Integration Test'),
            tags=Tags.from_list(['rio primero', 'argentina', 'integration-test']),
            user_id=self.user_id,
        )
        self.command_bus.dispatch(create_project_command)

        # Step 2: Create Model
        create_model_command = CreateModelCommand(
            project_id=self.project_id,
            user_id=self.user_id,
            model_id=self.model_id,
            geometry=self.polygon,
            n_cols=100,
            n_rows=50,
            rotation=Rotation.from_float(0.0),
        )
        self.command_bus.dispatch(create_model_command)

        # Step 3: Update Time Discretization
        time_discretization = TimeDiscretization(
            start_date_time=StartDateTime.from_datetime(datetime(2015, 1, 1)),
            end_date_time=EndDateTime.from_datetime(datetime(2020, 12, 31)),
            stress_periods=StressPeriodCollection(
                [
                    StressPeriod(
                        start_date_time=StartDateTime.from_datetime(datetime(2015, 1, 1)),
                        number_of_time_steps=NumberOfTimeSteps(1),
                        time_step_multiplier=TimeStepMultiplier(1),
                        steady_state=IsSteadyState.yes(),
                    ),
                ]
            ),
            time_unit=TimeUnit.days(),
        )

        update_time_discretization_command = UpdateModelTimeDiscretizationCommand(
            project_id=self.project_id,
            time_discretization=time_discretization,
            user_id=self.user_id,
        )
        self.command_bus.dispatch(update_time_discretization_command)

        # Step 4: Create Top Layer
        top_layer_id = LayerId.new()
        create_top_layer_command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=top_layer_id,
            name=LayerName('Top Layer'),
            confinement=LayerConfinement.convertible(),
            description=LayerDescription('Top Layer'),
            properties=LayerProperties.from_values(top=460, bottom=450, initial_head=460, hk=8.64, hani=1, vka=0.864, specific_storage=1e-5, specific_yield=0.2),
        )
        self.command_bus.dispatch(create_top_layer_command)

        # Verify top layer was created
        model = self.model_reader.get_latest_model(self.project_id)
        assert len(model.layers) == 2  # Default layer + top layer
        assert any(layer.name.value == 'Top Layer' for layer in model.layers)

        # Step 5: Create Aquitard Layer
        aquitard_layer_id = LayerId.new()
        create_aquitard_command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=aquitard_layer_id,
            name=LayerName('Aquitard'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Aquitard'),
            properties=LayerProperties.from_values(
                top=450.0,
                bottom=448.0,
                initial_head=450.0,
                hk=10,
                hani=1,
                vka=0.1,
                specific_storage=1e-5,
                specific_yield=0.2,
            ),
        )
        self.command_bus.dispatch(create_aquitard_command)

        # Step 6: Create Aquifer Layer
        aquifer_layer_id = LayerId.new()
        create_aquifer_command = CreateModelLayerCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=aquifer_layer_id,
            name=LayerName('Aquifer'),
            confinement=LayerConfinement.confined(),
            description=LayerDescription('Aquifer'),
            properties=LayerProperties.from_values(
                top=448,
                bottom=390,
                initial_head=448,
                hk=8.64,
                hani=1,
                vka=0.864,
                specific_storage=1e-5,
                specific_yield=0.2,
            ),
        )
        self.command_bus.dispatch(create_aquifer_command)

        # Verify all layers were created
        model = self.model_reader.get_latest_model(self.project_id)
        assert len(model.layers) == 4  # Default + 3 new layers

        # Step 7: Remove Default Layer
        model = self.model_reader.get_latest_model(self.project_id)
        layers = model.layers
        default_layer_id = layers[0].layer_id

        delete_default_layer_command = DeleteModelLayerCommand(project_id=self.project_id, model_id=self.model_id, user_id=self.user_id, layer_id=default_layer_id)
        self.command_bus.dispatch(delete_default_layer_command)

        # Verify default layer was deleted
        model = self.model_reader.get_latest_model(self.project_id)
        assert len(model.layers) == 3  # Only the 3 new layers remain

        # Step 8: Update Bottom Layer Metadata
        model = self.model_reader.get_latest_model(self.project_id)
        layers = model.layers
        bottom_layer_id = layers[-1].layer_id

        update_layer_metadata_command = UpdateModelLayerMetadataCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=bottom_layer_id,
            layer_name=LayerName('Bottom Layer'),
            layer_description=LayerDescription('Bottom Layer'),
        )
        self.command_bus.dispatch(update_layer_metadata_command)

        # Verify metadata was updated
        model = self.model_reader.get_latest_model(self.project_id)
        assert model.layers[-1].name.value == 'Bottom Layer'
        assert model.layers[-1].description.value == 'Bottom Layer'

        # Step 9: Update Layer Property Default Value
        update_property_command = UpdateModelLayerPropertyDefaultValueCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=bottom_layer_id,
            property_name=LayerPropertyName.from_value('hk'),
            property_default_value=LayerPropertyDefaultValue.from_value(8.64),
        )
        self.command_bus.dispatch(update_property_command)

        # Verify property was updated
        model = self.model_reader.get_latest_model(self.project_id)
        assert model.layers[-1].properties.hk.value.value == 8.64

        # Step 10: Update Layer Property with Zones
        bottom_left_top_right_polygons = MultiPolygon(
            type='MultiPolygon',
            coordinates=[
                [[(13.92223, 50.9647), (13.92223, 50.9650), (13.92400, 50.9650), (13.92400, 50.9647), (13.92223, 50.9647)]],
                [[(13.924, 50.965), (13.924, 50.966), (13.925, 50.966), (13.925, 50.965), (13.924, 50.965)]],
            ],
        )

        bottom_right_polygon = Polygon(type='Polygon', coordinates=[[(13.923, 50.965), (13.923, 50.966), (13.924, 50.966), (13.924, 50.965), (13.923, 50.965)]])

        zones = [
            LayerPropertyZoneWithOptionalAffectedCells.from_payload({'name': 'Zone 1', 'geometry': bottom_left_top_right_polygons.to_dict(), 'value': 5}),
            LayerPropertyZoneWithOptionalAffectedCells.from_payload({'name': 'Zone 2', 'geometry': bottom_right_polygon.to_dict(), 'value': 10}),
        ]

        update_zones_command = UpdateModelLayerPropertyZonesCommand(
            project_id=self.project_id,
            model_id=self.model_id,
            user_id=self.user_id,
            layer_id=bottom_layer_id,
            property_name=LayerPropertyName.from_value('hk'),
            property_zones=zones,
        )
        self.command_bus.dispatch(update_zones_command)

        # Verify zones were applied
        model = self.model_reader.get_latest_model(self.project_id)
        hk_data = model.layers[-1].properties.hk.get_data()
        assert hk_data is not None
        # The data should be a 2D array/list with zone values applied
        # Convert to list if it's a numpy array, or check length if it's a list
        if hasattr(hk_data, 'shape'):
            assert hk_data.shape == (50, 100)  # n_rows x n_cols
        else:
            # It's a list - verify it has the expected structure
            assert isinstance(hk_data, list)
            assert len(hk_data) == 50  # n_rows
            assert all(len(row) == 100 for row in hk_data)  # n_cols per row

        # Step 11: Verify Model Versions
        versions = self.model_reader.get_versions(project_id=self.project_id)
        assert len(versions) > 0
        assert versions[0].tag.value == 'v0.0.0'

        # Final verification: Check final model state
        final_model = self.model_reader.get_latest_model(self.project_id)
        assert len(final_model.layers) == 3
        assert final_model.layers[0].name.value == 'Top Layer'
        assert final_model.layers[1].name.value == 'Aquitard'
        assert final_model.layers[2].name.value == 'Bottom Layer'
