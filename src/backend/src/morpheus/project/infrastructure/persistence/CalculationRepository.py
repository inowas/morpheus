import dataclasses
from datetime import datetime

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.project.types.Model import ModelId
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, Calculation, CalculationState, CalculationLog, CheckModelLog
from morpheus.project.types.calculation.CalculationProfile import CalculationProfileId, CalculationEngineType
from morpheus.project.types.calculation.CalculationResult import CalculationResult
from morpheus.settings import settings


@dataclasses.dataclass(frozen=True)
class CalculationRepositoryDocument:
    project_id: str
    calculation_id: str
    model_id: str
    model_hash: str
    model_version: str
    profile_id: str
    profile_hash: str
    engine_type: str
    lifecycle: list[CalculationState]
    state: CalculationState
    check_model_log: list[str] | None
    calculation_log: list[str] | None
    result: dict | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def create(cls, project_id: ProjectId, calculation_id: CalculationId, model_id: ModelId, model_hash: str, model_version: str, profile_id: CalculationProfileId, profile_hash: str,
               engine_type: CalculationEngineType, created_at: datetime) -> 'CalculationRepositoryDocument':
        return cls(
            project_id=project_id.to_str(),
            calculation_id=calculation_id.to_str(),
            model_id=model_id.to_str(),
            model_hash=model_hash,
            model_version=model_version,
            profile_id=profile_id.to_str(),
            profile_hash=profile_hash,
            engine_type=engine_type,
            lifecycle=[CalculationState.CREATED],
            state=CalculationState.CREATED,
            check_model_log=None,
            calculation_log=None,
            result=None,
            created_at=created_at,
            updated_at=created_at
        )

    @classmethod
    def from_raw_document(cls, raw_document: dict):
        return cls(
            project_id=raw_document['project_id'],
            calculation_id=raw_document['calculation_id'],
            model_id=raw_document['model_id'],
            model_hash=raw_document['model_hash'],
            model_version=raw_document['model_version'],
            profile_id=raw_document['profile_id'],
            profile_hash=raw_document['profile_hash'],
            engine_type=raw_document['engine_type'],
            lifecycle=raw_document['lifecycle'],
            state=raw_document['state'],
            check_model_log=raw_document['check_model_log'],
            calculation_log=raw_document['calculation_log'],
            result=raw_document['result'],
            created_at=raw_document['created_at'],
            updated_at=raw_document['updated_at'],
        )

    def to_calculation(self) -> Calculation:
        return Calculation(
            project_id=ProjectId.from_str(self.project_id),
            calculation_id=CalculationId.from_str(self.calculation_id),
            model_id=ModelId.from_str(self.model_id),
            model_hash=self.model_hash,
            model_version=self.model_version,
            profile_id=CalculationProfileId.from_str(self.profile_id),
            profile_hash=self.profile_hash,
            engine_type=CalculationEngineType(self.engine_type),
            lifecycle=self.lifecycle,
            state=self.state,
            check_model_log=CheckModelLog.from_list(self.check_model_log) if self.check_model_log is not None else None,
            calculation_log=CalculationLog.from_list(self.calculation_log) if self.calculation_log is not None else None,
            result=CalculationResult.try_from_dict(self.result) if self.result is not None else None,
        )

    def to_dict(self):
        return dataclasses.asdict(self)


class CalculationRepository(RepositoryBase):
    def has_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> bool:
        return self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        }) is not None

    def create_calculation(self, project_id: ProjectId, calculation_id: CalculationId, model_id: ModelId, model_hash: str, model_version: str, profile_id: CalculationProfileId, profile_hash: str,
                           engine_type: CalculationEngineType, created_at: datetime) -> None:
        if self.has_calculation(project_id=project_id, calculation_id=calculation_id):
            raise Exception(f'Calculation {calculation_id.to_str()} already exists.')

        document = CalculationRepositoryDocument.create(
            project_id=project_id,
            calculation_id=calculation_id,
            model_id=model_id,
            model_hash=model_hash,
            model_version=model_version,
            profile_id=profile_id,
            profile_hash=profile_hash,
            engine_type=engine_type,
            created_at=created_at
        )
        self.collection.insert_one(document.to_dict())

    def update_calculation(self, calculation: Calculation, updated_at: datetime) -> None:
        self.collection.update_one(
            {'project_id': calculation.project_id.to_str(), 'calculation_id': calculation.calculation_id.to_str()},
            {'$set': {
                'lifecycle': calculation.lifecycle,
                'state': calculation.state,
                'check_model_log': calculation.check_model_log.to_list() if calculation.check_model_log is not None else None,
                'calculation_log': calculation.calculation_log.to_list() if calculation.calculation_log is not None else None,
                'result': calculation.result.to_dict() if calculation.result is not None else None,
                'updated_at': updated_at
            }}
        )

    def delete_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> None:
        self.collection.delete_one({'project_id': project_id.to_str(), 'calculation_id': calculation_id.to_str()})

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> Calculation | None:
        raw_document = self.collection.find_one({'project_id': project_id.to_str(), 'calculation_id': calculation_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        return Calculation.from_dict(raw_document)

    def get_calculations(self, project_id: ProjectId) -> list[Calculation]:
        raw_documents = self.collection.find({'project_id': project_id.to_str()})
        return [Calculation.from_dict(raw_document) for raw_document in raw_documents]


calculation_repository = CalculationRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'calculations'
    )
)


def get_calculation_repository() -> CalculationRepository:
    return calculation_repository
