from morpheus.common.infrastructure.persistence.mongodb import Database, get_database_client
from morpheus.modflow.infrastructure.calculation.modflow_2005.types.Mf2005Calculation import Mf2005Calculation
from morpheus.modflow.infrastructure.calculation.types.CalculationBase import CalculationId, CalculationBase, \
    CalculationResult, CalculationState
from morpheus.settings import settings


class CalculationRepository:
    db: Database
    collection_name: str = 'calculations'
    collection = None

    def __init__(self):
        self.db = get_database_client(settings.MONGO_MODFLOW_DATABASE, create_if_not_exist=True)
        self.collection = self.get_or_create_collection(self.collection_name)

    def create_collection(self, collection_name: str) -> None:
        self.db.create_collection(collection_name)

    def get_collection(self, collection_name: str):
        return self.db.get_collection(collection_name)

    def has_collection(self, collection_name: str) -> bool:
        return collection_name in self.list_collection_names()

    def list_collection_names(self) -> list[str]:
        return self.db.list_collection_names()

    def get_or_create_collection(self, collection_name: str):
        if not self.has_collection(collection_name):
            self.create_collection(collection_name)
        return self.get_collection(collection_name)

    def has_calculation(self, calculation_id: CalculationId) -> bool:
        return self.collection.find_one({'calculation_id': calculation_id.to_str()}) is not None

    def get_calculation(self, calculation_id: CalculationId) -> CalculationBase | None:
        calculation_dict = self.collection.find_one({'calculation_id': calculation_id.to_str()}, {'_id': 0})
        if calculation_dict is None:
            return None

        return Mf2005Calculation.from_dict(calculation_dict)

    def safe_calculation(self, calculation: CalculationBase) -> None:
        if self.has_calculation(calculation_id=calculation.calculation_id):
            raise Exception('Calculation already exists.')

        self.collection.insert_one(calculation.to_dict())

    def update_calculation(self, calculation: CalculationBase) -> None:
        if not self.has_calculation(calculation_id=calculation.calculation_id):
            raise Exception('Calculation does not exist yet.')

        self.collection.replace_one({'calculation_id': calculation.calculation_id.to_str()}, calculation.to_dict())

    def update_calculation_result(self, calculation: CalculationBase, result: CalculationResult | None) -> None:
        if not self.has_calculation(calculation_id=calculation.calculation_id):
            raise Exception('Calculation does not exist yet.')

        self.collection.update_one(
            {'calculation_id': calculation.calculation_id.to_str()},
            {'$set': {'result': result.to_dict() if result is not None else None}}
        )

    def update_calculation_state(self, calculation: CalculationBase) -> None:
        if not self.has_calculation(calculation_id=calculation.calculation_id):
            raise Exception('Calculation does not exist yet.')

        self.collection.update_one(
            {'calculation_id': calculation.calculation_id.to_str()},
            {'$set': {'calculation_state': calculation.calculation_state.to_str()}}
        )

    def delete_calculation(self, calculation_id: CalculationId) -> None:
        if not self.has_calculation(calculation_id=calculation_id):
            raise Exception('Calculation does not exist yet.')

        self.collection.delete_one({'calculation_id': calculation_id.to_str()})
