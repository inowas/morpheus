from .Boundaries import model_boundaries_command_handler_map
from .Discretization import model_discretization_command_handler_map
from .General import model_general_command_handler_map
from .Layers import model_layers_command_handler_map
from .Observations import model_observations_command_handler_map

model_command_handler_map = {
    **model_boundaries_command_handler_map,
    **model_discretization_command_handler_map,
    **model_general_command_handler_map,
    **model_layers_command_handler_map,
    **model_observations_command_handler_map,
}
