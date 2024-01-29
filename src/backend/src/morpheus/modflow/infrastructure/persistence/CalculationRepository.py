from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, \
    create_or_get_collection
from morpheus.modflow.types.calculation.Calculation import CalculationId, Calculation
from morpheus.modflow.types.calculation.CalculationResult import CalculationResult
from morpheus.settings import settings


class CalculationRepository(RepositoryBase):
    def has_calculation(self, calculation_id: CalculationId) -> bool:
        return self.collection.find_one({'calculation_id': calculation_id.to_str()}) is not None

    def get_calculation(self, calculation_id: CalculationId) -> Calculation | None:
        calculation_dict = self.collection.find_one({'calculation_id': calculation_id.to_str()}, {'_id': 0})
        if calculation_dict is None:
            return None

        return Calculation.from_dict(calculation_dict)

    def get_calculation_result(self, calculation_id: CalculationId) -> CalculationResult | None:
        calculation_dict = self.collection.find_one({'calculation_id': calculation_id.to_str()},
                                                    {'_id': 0, 'calculation_result': 1})
        if calculation_dict is None:
            return None

        return CalculationResult.try_from_dict(calculation_dict['calculation_result'])

    def save_calculation(self, calculation: Calculation) -> None:
        if self.has_calculation(calculation_id=calculation.calculation_id):
            raise Exception('Calculation already exists.')

        self.collection.insert_one(calculation.to_dict())

    def update_calculation(self, calculation: Calculation) -> None:
        if not self.has_calculation(calculation_id=calculation.calculation_id):
            raise Exception('Calculation does not exist yet.')

        self.collection.replace_one({'calculation_id': calculation.calculation_id.to_str()}, calculation.to_dict())

    def delete_calculation(self, calculation_id: CalculationId) -> None:
        if not self.has_calculation(calculation_id=calculation_id):
            raise Exception('Calculation does not exist yet.')

        self.collection.delete_one({'calculation_id': calculation_id.to_str()})


calculation_repository = CalculationRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True),
        'calculations'
    )
)
