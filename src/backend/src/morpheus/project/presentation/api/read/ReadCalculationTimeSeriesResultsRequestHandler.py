from morpheus.common.types.Exceptions import InsufficientPermissionsException, NotFoundException
from ....application.read.PermissionsReader import permissions_reader
from ....incoming import get_identity
from ....application.read.CalculationReader import get_calculation_reader
from ....infrastructure.calculation.engines.base.CalculationEngineFactory import CalculationEngineFactory
from ....types.Project import ProjectId
from ....types.calculation.Calculation import CalculationId
from ....types.permissions.Privilege import Privilege


class ReadCalculationTimeSeriesResultsRequestHandler:
    def handle(self, project_id: ProjectId, calculation_id: CalculationId, result_type: str, layer: int = 0, row: int = 0, col: int = 0):
        identity = get_identity()
        if identity is None:
            return '', 401

        try:
            permissions_reader.assert_identity_can(Privilege.VIEW_PROJECT, identity, project_id)
            available_result_types = ['head', 'drawdown', 'concentration']

            if result_type not in available_result_types:
                raise ValueError(f'Result type not found, available types are: {", ".join(available_result_types)}')

            calculation_reader = get_calculation_reader()
            calculation = calculation_reader.get_calculation(project_id=project_id, calculation_id=calculation_id)

            if calculation is None:
                raise NotFoundException(f'Calculation {calculation_id.to_str()} not found in project {project_id.to_str()}')

            model = calculation_reader.get_model_by_calculation_id(project_id=project_id, calculation_id=calculation_id)
            if model is None:
                raise NotFoundException(f'Model for calculation {calculation_id.to_str()} not found in project {project_id.to_str()}')

            if model.layers.number_of_layers() <= layer:
                raise NotFoundException(f'Layer {layer} not found in model {model.model_id.to_str()}')

            if model.spatial_discretization.grid.n_rows() <= row:
                raise NotFoundException(f'Row {row} not found in model {model.model_id.to_str()}')

            if model.spatial_discretization.grid.n_cols() <= col:
                raise NotFoundException(f'Column {col} not found in model {model.model_id.to_str()}')

            engine = CalculationEngineFactory.create_engine(calculation_id=calculation_id, engine_type=calculation.get_engine_type())

            if result_type == 'head':
                data = engine.read_flow_head_time_series(layer=layer, row=row, col=col, precision=4)
                data = [[None if cell < -999 else cell for cell in row] for row in data]
                data = [[round(cell, 3) if cell is not None else cell for cell in row] for row in data]

                result = {
                    'result_type': result_type,
                    'layer_idx': layer,
                    'row_idx': row,
                    'col_idx': col,
                    'data': data
                }

                return result, 200

            if result_type == 'concentration':
                data = engine.read_transport_concentration_time_series(layer=layer, row=row, col=col, precision=4)
                data = [[None if cell < -999 else cell for cell in row] for row in data]

                result = {
                    'result_type': result_type,
                    'layer_idx': layer,
                    'row_idx': row,
                    'col_idx': col,
                    'data': data
                }

                return result, 200

            raise ValueError(f'Result type not found, available types are: {", ".join(available_result_types)}')
        except ValueError as e:
            return str(e), 400
        except NotImplementedError as e:
            return str(e), 400
        except InsufficientPermissionsException as e:
            return str(e), 403
        except NotFoundException as e:
            return {'message': str(e)}, 404
