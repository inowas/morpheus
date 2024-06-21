import dataclasses
from datetime import datetime

from morpheus.common.infrastructure.persistence.mongodb import get_database_client, RepositoryBase, create_or_get_collection
from morpheus.project.types.Model import Model
from morpheus.project.types.Project import ProjectId
from morpheus.project.types.calculation.Calculation import CalculationId, Calculation, CalculationState, Log
from morpheus.project.types.calculation.CalculationProfile import CalculationProfile
from morpheus.project.types.calculation.CalculationResult import CalculationResult
from morpheus.settings import settings


@dataclasses.dataclass(frozen=True)
class CalculationRepositoryDocument:
    calculation_id: str
    project_id: str
    model: dict
    model_version: str
    profile: dict
    lifecycle: list[CalculationState]
    state: CalculationState
    check_model_log: list[str] | None
    calculation_log: list[str] | None
    result: dict | None
    last_modified_at: datetime
    created_at: datetime

    @classmethod
    def from_dict(cls, obj):
        return cls(
            calculation_id=obj['calculation_id'],
            project_id=obj['project_id'],
            model=obj['model'],
            model_version=obj['model_version'],
            profile=obj['profile'],
            lifecycle=[CalculationState(state) for state in obj['lifecycle']],
            state=CalculationState(obj['state']),
            check_model_log=obj['check_model_log'],
            calculation_log=obj['calculation_log'],
            result=obj['result'],
            created_at=obj['created_at'],
            last_modified_at=obj['last_modified_at']
        )

    def to_dict(self):
        return dataclasses.asdict(self)

    def to_calculation(self):
        model = Model.from_dict(self.model)
        profile = CalculationProfile.from_dict(self.profile)
        return Calculation(
            project_id=ProjectId.from_str(self.project_id),
            calculation_id=CalculationId.from_str(self.calculation_id),
            model_id=model.model_id,
            model_hash=model.get_sha1_hash().to_str(),
            model_version=self.model_version,
            profile_id=profile.id,
            profile_hash=profile.get_sha1_hash().to_str(),
            engine_type=profile.engine_type,
            lifecycle=self.lifecycle,
            state=self.state,
            check_model_log=Log.try_from_list(self.check_model_log),
            calculation_log=Log.try_from_list(self.calculation_log),
            result=CalculationResult.from_dict(self.result) if self.result is not None else None,
        )


class CalculationRepository(RepositoryBase):
    def has_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> bool:
        return self.collection.find_one({
            'project_id': project_id.to_str(),
            'calculation_id': calculation_id.to_str()
        }) is not None

    def create_calculation(self, project_id: ProjectId, calculation_id: CalculationId, model: Model, model_version: str, profile: CalculationProfile) -> None:

        if self.has_calculation(project_id=project_id, calculation_id=calculation_id):
            raise Exception(f'Calculation {calculation_id.to_str()} already exists.')

        document = CalculationRepositoryDocument(
            calculation_id=calculation_id.to_str(),
            project_id=project_id.to_str(),
            model=model.to_dict(),
            model_version=model_version,
            profile=profile.to_dict(),
            lifecycle=[CalculationState.CREATED],
            state=CalculationState.CREATED,
            check_model_log=None,
            calculation_log=None,
            result=None,
            last_modified_at=datetime.now(),
            created_at=datetime.now()
        )

        self.collection.insert_one(document.to_dict())

    def update_calculation_state(self, calculation_id: CalculationId, state: CalculationState) -> None:
        self.collection.update_one(
            {'calculation_id': calculation_id.to_str()},
            {'$set': {
                'lifecycle': {'$push': state},
                'state': state,
                'last_modified_at': datetime.now()
            }}
        )

    def update_calculation_check_model_log(self, calculation_id: CalculationId, check_model_log: Log) -> None:
        self.collection.update_one(
            {'calculation_id': calculation_id.to_str()},
            {'$set': {
                'check_model_log': check_model_log.to_list(),
                'last_modified_at': datetime.now()
            }}
        )

    def update_calculation_log(self, calculation_id: CalculationId, calculation_log: Log) -> None:
        self.collection.update_one(
            {'calculation_id': calculation_id.to_str()},
            {'$set': {
                'calculation_log': calculation_log.to_list(),
                'last_modified_at': datetime.now()
            }}
        )

    def update_calculation_result(self, calculation_id: CalculationId, result: CalculationResult) -> None:
        self.collection.update_one(
            {'calculation_id': calculation_id.to_str()},
            {'$set': {
                'result': result.to_dict(),
                'last_modified_at': datetime.now()
            }}
        )

    def delete_calculation_by_id(self, calculation_id: CalculationId) -> None:
        self.collection.delete_one({'calculation_id': calculation_id.to_str()})

    def get_calculation_by_id(self, calculation_id: CalculationId) -> Calculation | None:
        raw_document = self.collection.find_one({'calculation_id': calculation_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        document = CalculationRepositoryDocument.from_dict(raw_document)
        return document.to_calculation()

    def get_model_by_calculation_id(self, calculation_id: CalculationId) -> Model | None:
        raw_document = self.collection.find_one({'calculation_id': calculation_id.to_str()}, {'_id': 0, 'model': 1})
        if raw_document is None:
            return None

        return Model.from_dict(raw_document['model'])

    def get_profile_by_calculation_id(self, calculation_id: CalculationId) -> CalculationProfile | None:
        raw_document = self.collection.find_one({'calculation_id': calculation_id.to_str()}, {'_id': 0, 'profile': 1})
        if raw_document is None:
            return None

        return CalculationProfile.from_dict(raw_document['profile'])

    def get_calculation(self, project_id: ProjectId, calculation_id: CalculationId) -> Calculation | None:
        raw_document = self.collection.find_one({'project_id': project_id.to_str(), 'calculation_id': calculation_id.to_str()}, {'_id': 0})
        if raw_document is None:
            return None

        document = CalculationRepositoryDocument.from_dict(raw_document)
        return document.to_calculation()

    def get_calculations_by_project_id(self, project_id: ProjectId) -> list[Calculation]:
        raw_documents = self.collection.find({'project_id': project_id.to_str()})
        return [CalculationRepositoryDocument.from_dict(raw_document).to_calculation() for raw_document in raw_documents]

    def delete_calculations_by_project_id(self, project_id: ProjectId) -> None:
        self.collection.delete_many({'project_id': project_id.to_str()})


calculation_repository = CalculationRepository(
    collection=create_or_get_collection(
        get_database_client(settings.MONGO_PROJECT_DATABASE, create_if_not_exist=True),
        'calculations'
    )
)


def get_calculation_repository() -> CalculationRepository:
    return calculation_repository
