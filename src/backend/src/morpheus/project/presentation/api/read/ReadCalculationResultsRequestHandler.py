import math
from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....application.read.CalculationReader import get_calculation_reader
from ....infrastructure.assets.RasterInterpolationService import RasterInterpolationService
from ....infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId
from ....types.permissions.Privilege import Privilege
from ....types.discretization.spatial import Grid


class ReadCalculationResultsRequestHandler:
    def _interpolate_data(self, data: list[list[float | None]], grid: Grid):
        raster_interpolator = RasterInterpolationService()
        target_resolution_x = grid.n_cols() if grid.n_cols() < 200 else int(grid.n_cols() / 2)
        result_data = raster_interpolator.grid_data_to_grid_data_with_equal_cells(grid=grid, data=data, target_resolution_x=target_resolution_x, no_data_value=None, expand=1)
        return result_data

    def _get_result_data_object(self, data: list[list[float | None]], grid: Grid):
        min_value = math.inf
        max_value = -math.inf
        for row_idx, row in enumerate(data):
            for cell_idx, cell in enumerate(row):
                if cell is not None:
                    min_value = min(min_value, cell)
                    max_value = max(max_value, cell)
                    data[row_idx][cell_idx] = round(cell, 4)

        return {
            'n_cols': len(data[0]),
            'n_rows': len(data),
            'outline': grid.get_wgs_outline_geometry().to_dict(),
            'rotation': grid.rotation.to_float(),
            'values': data,
            'min_value': min_value if not math.isinf(min_value) else None,
            'max_value': max_value if not math.isinf(max_value) else None
        }

    def handle(self, project_id: ProjectId, calculation_id: CalculationId, result_type: str, time_idx: int, layer_idx: int = 0, incremental: bool = False):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            available_result_types = ['flow_head', 'flow_drawdown', 'flow_budget', 'transport_concentration', 'transport_budget']

            if result_type not in available_result_types:
                raise ValueError(f'Result type not found, available types are: {", ".join(available_result_types)}')

            calculation_reader = get_calculation_reader()
            calculation = calculation_reader.get_calculation(project_id=project_id, calculation_id=calculation_id)

            if calculation is None:
                raise NotFoundException(f'Calculation {calculation_id.to_str()} not found in project {project_id.to_str()}')

            model = calculation_reader.get_model_by_calculation_id(project_id=project_id, calculation_id=calculation_id)
            if model is None:
                raise NotFoundException(f'Model for calculation {calculation_id.to_str()} not found in project {project_id.to_str()}')

            engine = CalculationEngineFactory.create_engine(calculation_id=calculation_id, engine_type=calculation.get_engine_type())
            grid = model.spatial_discretization.grid

            if result_type == 'flow_head':
                data = engine.read_flow_head(idx=time_idx, layer=layer_idx, precision=4)
                data = [[None if cell < -999 else cell for cell in row] for row in data]

                # interpolate data to irregular grid
                if not grid.is_regular() or grid.n_cols() > 200:
                    data = self._interpolate_data(data, grid)

                result = {
                    'result_type': result_type,
                    'layer_idx': layer_idx,
                    'time_idx': time_idx,
                    'data': self._get_result_data_object(data=data, grid=grid)
                }

                return result, 200

            if result_type == 'flow_drawdown':
                data = engine.read_flow_drawdown(idx=time_idx, layer=layer_idx, precision=4)
                data = [[None if cell < -999 else cell for cell in row] for row in data]

                # interpolate data to irregular grid
                if not grid.is_regular():
                    data = self._interpolate_data(data, grid)

                result = {
                    'result_type': result_type,
                    'layer_idx': layer_idx,
                    'time_idx': time_idx,
                    'data': self._get_result_data_object(data=data, grid=grid)
                }

                return result, 200

            if result_type == 'transport_concentration':
                data = engine.read_transport_concentration(idx=time_idx, layer=layer_idx, precision=4)
                data = [[None if cell < -999 else cell for cell in row] for row in data]

                # interpolate data to irregular grid
                if not grid.is_regular():
                    data = self._interpolate_data(data, grid)

                result = {
                    'result_type': result_type,
                    'layer_idx': layer_idx,
                    'time_idx': time_idx,
                    'data': self._get_result_data_object(data=data, grid=grid)
                }

                return result, 200

            if result_type == 'flow_budget':
                data = engine.read_flow_budget(idx=time_idx, incremental=incremental)
                result = {
                    'result_type': result_type,
                    'time_idx': time_idx,
                    'data': data,
                    'incremental': incremental
                }
                return result, 200

            if result_type == 'transport_budget':
                data = engine.read_transport_budget(idx=time_idx, incremental=incremental)
                result = {
                    'result_type': result_type,
                    'time_idx': time_idx,
                    'data': data,
                    'incremental': incremental
                }
                return result, 200

            raise ValueError(f'Result type not found, available types are: {", ".join(available_result_types)}')
        except ValueError as e:
            return str(e), 400
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException as e:
            return {'message': str(e)}, 404
