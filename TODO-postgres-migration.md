# Migration Plan: MongoDB -> Postgres

## Decisions

| # | Decision             | Choice                                                              |
|---|----------------------|---------------------------------------------------------------------|
| 1 | Scope                | Event Store + Projections -> Postgres; Sensor data stays in MongoDB |
| 2 | Database             | Postgres (prod) + SQLite in-memory (tests)                          |
| 3 | Session management   | `RepositoryFactory` with shared `Session`                           |
| 4 | Dependency injection | Constructor injection for command handlers                          |
| 5 | Transaction boundary | Factory pro dispatch: `commit()`/`rollback()`/`close()`             |
| 6 | Event store tables   | Separate tables: `project_events`, `user_events`, `group_events`    |
| 7 | Data migration       | Clean start for dev; migration script for prod                      |
| 8 | Schema management    | `SQLModel.metadata.create_all()` for tests; Alembic for prod        |
| 9 | Postgres container   | Dedicated `postgres_backend` service                                |

## Phase 1: Docker & Infrastructure

- [ ] Add `postgres_backend` service to `infrastructure/local/docker-compose.yml`
  - Image: `postgres:16`
  - Volume: `postgres_backend_data` (already defined)
  - Port 5432 already forwarded through Traefik
  - Environment: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- [ ] Add `postgres_backend` service to `infrastructure/production/morpheus/docker-compose.yml`
- [ ] Update backend `depends_on` to include `postgres_backend` (alongside `mongodb_backend` for sensors)
- [ ] Add `DATABASE_URL` to `.env` (e.g. `postgresql://dev:dev@localhost:5432/morpheus`)
- [ ] Update `settings.py`: add `DATABASE_URL`, keep `MONGO_*` settings for sensors
- [ ] Add `sqlmodel` to `pyproject.toml` (SQLAlchemy + psycopg2-binary already present)

## Phase 2: Persistence Foundation (`common/persistence/`)

- [ ] Create `common/persistence/SqlAlchemy.py`
  - `create_engine` wrapper
  - Re-export: `Engine`, `func`, `select`, `insert`, `MetaData`, `Table`, `Column`, `String`, `Integer`, `BigInteger`,
    `JSON`, `TIMESTAMP`, `Uuid`, `or_`, `RowMapping`, `orm`
- [ ] Create `common/persistence/SqlModel.py`
  - Re-export: `SQLModel`, `Field`, `Session`, `JSON`, `func`, `or_`, `select`, `PrimaryKeyConstraint`
- [ ] Create `common/persistence/RepositoryBase.py`
  - Base class with `engine`/`session` injection
  - Abstract `truncate()` and `count()`

## Phase 3: Event Store Migration

- [ ] Create `EventStoreDocument(SQLModel, table=True)` per bounded context:
  - `seq: int | None` (PK, autoincrement)
  - `entity_uuid: str` (max 36, not null)
  - `event_name: str` (max 128, not null)
  - `event_version: int` (default 0)
  - `occurred_at: datetime` (not null)
  - `payload: dict` (JSON, not null)
  - `metadata: dict` (JSON, not null)
  - `version: str` (max 36, uuid7)
  - Unique index on `(entity_uuid, version)`
  - Index on `entity_uuid`
- [ ] Create abstract `EventRepository(RepositoryBase)`:
  - `insert(event_envelope)` -> creates `EventStoreDocument`, adds to session
  - `find_all_ordered_by_version()` -> `select(...).order_by(seq)`
  - `find_all_by_entity_uuid_ordered_by_version(entity_uuid)`
  - `truncate()`
- [ ] Implement `ProjectEventRepository` (table: `project_events`)
- [ ] Implement `UserEventRepository` (table: `user_events`)
- [ ] Implement `GroupEventRepository` (table: `group_events`)
- [ ] Remove module-level singleton instantiation from all event repositories

## Phase 4: Projection Repository Migration

For each repository:

1. Define `XxxDocument(SQLModel, table=True)` with real columns
2. Inherit from `RepositoryBase` (with session injection)
3. Replace pymongo collection operations with SQLModel/SQLAlchemy queries
4. Remove module-level singleton instantiation
5. Implement `truncate()` and `count()`

- [ ] `ModelRepository` -> `models` table
- [ ] `ModelVersionTagRepository` -> `model_version_tags` table
- [ ] `PermissionsRepository` -> `permissions` table
- [ ] `ProjectSummaryRepository` -> `project_summaries` table
- [ ] `CalculationProfilesRepository` -> `calculation_profiles` table
- [ ] `PreviewImageRepository` -> `preview_images` table
- [ ] `UserRoleAssignmentRepository` -> `user_role_assignments` table
- [ ] `ScenariosRepository` -> `scenarios` table
- [ ] `AssetRepository` -> `assets` table
- [ ] `UserRepository` -> `users` table
- [ ] `GroupRepository` -> `groups` table

## Phase 5: RepositoryFactory Pattern

- [ ] Create `ProjectRepositoryFactory`:
  - `__init__(engine)` -> creates `Session(engine, autoflush=True)`
  - `get_project_event_repository()`
  - `get_model_repository()`
  - `get_permissions_repository()`
  - `get_project_summary_repository()`
  - `get_calculation_profiles_repository()`
  - `get_preview_image_repository()`
  - `get_user_role_assignment_repository()`
  - `get_scenarios_repository()`
  - `get_asset_repository()`
  - `create_event_bus()` -> wires EventStore + EventPublisher with projectors
  - `commit()` / `rollback()` / `close()`
- [ ] Create `UserRepositoryFactory` (same pattern for user context):
  - `get_user_event_repository()`
  - `get_group_event_repository()`
  - `get_user_repository()`
  - `get_group_repository()`
  - `create_event_bus()`
  - `commit()` / `rollback()` / `close()`

## Phase 6: Command Handler Refactor

For each command handler:

1. Add `__init__(self, repository_factory)` constructor
2. Replace singleton repo access with factory-provided repos
3. Replace `project_event_bus.record(envelope)` with `factory.create_event_bus().record(envelope)`
4. Add `factory.commit()` on success
5. Add `factory.rollback()` on failure

- [ ] `CreateProjectCommandHandler`
- [ ] `DeleteProjectCommandHandler`
- [ ] `UpdateProjectMetadataCommandHandler`
- [ ] `UpdateProjectVisibilityCommandHandler`
- [ ] `AddProjectMemberCommandHandler`
- [ ] `RemoveProjectMemberCommandHandler`
- [ ] `UpdateProjectMemberRoleCommandHandler`
- [ ] `UpdateProjectCalculationProfileIdCommandHandler`
- [ ] `CreateModelCommandHandler`
- [ ] `CreateModelVersionCommandHandler`
- [ ] `DeleteModelVersionCommandHandler`
- [ ] `UpdateModelVersionDescriptionCommandHandler`
- [ ] `AddModelLayerCommandHandler`
- [ ] `UpdateModelLayerCommandHandler`
- [ ] `DeleteModelLayerCommandHandler`
- [ ] `CloneModelLayerCommandHandler`
- [ ] `AddModelBoundaryCommandHandler`
- [ ] `UpdateModelBoundaryCommandHandler`
- [ ] `RemoveModelBoundaryCommandHandler`
- [ ] `CloneModelBoundaryCommandHandler`
- [ ] `EnableModelBoundaryCommandHandler`
- [ ] `DisableModelBoundaryCommandHandler`
- [ ] `AddModelBoundaryObservationCommandHandler`
- [ ] `UpdateModelBoundaryObservationCommandHandler`
- [ ] `RemoveModelBoundaryObservationCommandHandler`
- [ ] `CloneModelBoundaryObservationCommandHandler`
- [ ] `ImportModelBoundariesCommandHandler`
- [ ] `UpdateModelGridCommandHandler`
- [ ] `UpdateModelGeometryCommandHandler`
- [ ] `UpdateModelTimeDiscretizationCommandHandler`
- [ ] `UpdateModelAffectedCellsCommandHandler`
- [ ] `UpdateModelLayerPropertyRasterReferenceCommandHandler`
- [ ] `UpdateModelLayerPropertyZonesCommandHandler`
- [ ] `UpdateModelLayerPropertyDefaultValueCommandHandler`
- [ ] `UpdateModelLayerMetadataCommandHandler`
- [ ] `UpdateModelLayerConfinementCommandHandler`
- [ ] `UpdateModelLayerOrderCommandHandler`
- [ ] `UpdateModelBoundaryAffectedLayersCommandHandler`
- [ ] `UpdateModelBoundaryTagsCommandHandler`
- [ ] `UpdateModelBoundaryMetadataCommandHandler`
- [ ] `AddModelObservationCommandHandler`
- [ ] `UpdateModelObservationCommandHandler`
- [ ] `RemoveModelObservationCommandHandler`
- [ ] `CloneModelObservationCommandHandler`
- [ ] `EnableModelObservationCommandHandler`
- [ ] `DisableModelObservationCommandHandler`
- [ ] `AddCalculationProfileCommandHandler`
- [ ] `UpdateCalculationProfileCommandHandler`
- [ ] `RemoveCalculationProfileCommandHandler`
- [ ] `UploadAssetCommandHandler`
- [ ] `DeletePreviewImageCommandHandler`
- [ ] `CreateOrUpdateUserFromKeycloakCommandHandler`
- [ ] `CreateGroupCommandHandler`
- [ ] `AddMemberToGroupCommandHandler`
- [ ] All remaining command handlers

## Phase 7: Read Model Refactor

For each reader:

1. Add `__init__(self, factory)` constructor
2. Replace singleton repo access with factory-provided repos
3. Remove module-level singleton instantiation

- [ ] `ProjectReader`
- [ ] `ModelReader`
- [ ] `CalculationProfilesReader`
- [ ] `PermissionsReader`
- [ ] `AssetReader`
- [ ] `ProjectEventLogReader`
- [ ] All remaining readers

## Phase 8: Projector Refactor

For each projector:

1. Add `__init__` with factory-provided repos
2. Remove module-level singleton instantiation
3. Wire through `RepositoryFactory.create_event_bus()`

- [ ] `ModelProjector`
- [ ] `PermissionsProjector`
- [ ] `ProjectSummaryProjector`
- [ ] `CalculationProfilesProjector`
- [ ] `PreviewImageProjector`
- [ ] `UserRoleAssignmentProjector`
- [ ] `UserProjector`
- [ ] `GroupProjector`

## Phase 9: Command Bus Refactor

- [ ] Update `CommandBus` to create factory pro dispatch:
  ```python
  def dispatch(self, command):
      factory = ProjectRepositoryFactory(self.engine)
      handler = handler_class(factory)
      try:
          result = handler.handle(command)
          factory.commit()
          return result
      except:
          factory.rollback()
          raise
      finally:
          factory.close()
  ```
- [ ] Update `command_bus` initialization to pass engine
- [ ] Update all `command_bus.dispatch()` call sites

## Phase 10: Test Infrastructure

- [ ] Create `conftest.py` with SQLite in-memory fixtures:
  - `engine` fixture: `create_engine('sqlite:///:memory:')`, `SQLModel.metadata.create_all(engine)`
  - `factory` fixture: `ProjectRepositoryFactory(engine=engine)`
  - `cleanup` fixture (autouse): dispose engine after test
- [ ] Create `BaseModuleTest` (following pi-pdh pattern):
  - Per-test fresh database
  - `truncate_tables()` in tearDown
- [ ] Add `@pytest.mark.mongo` marker for sensor tests
- [ ] Configure pytest to skip `@pytest.mark.mongo` tests when MongoDB is unavailable
- [ ] Migrate existing tests to use factory pattern

## Phase 11: Alembic & Schema Management

- [ ] Initialize Alembic: `alembic init migrations`
- [ ] Configure `migrations/env.py` with `SQLModel.metadata`
- [ ] Create first migration: `alembic revision --autogenerate -m "initial schema"`
- [ ] Verify migration creates all tables correctly
- [ ] Add `alembic upgrade head` to deployment scripts

## Phase 12: Sensor Module (Minimal Changes)

- [ ] Keep sensor module on MongoDB (no changes to sensor code)
- [ ] Ensure `conftest.py` provides separate MongoDB fixture for sensor tests
- [ ] Mark all sensor tests with `@pytest.mark.mongo`
- [ ] Verify sensor CLI (`sync-uit-sensors`) still works with MongoDB

## Phase 13: Cleanup & Removal

- [ ] Remove `pymongo` from `pyproject.toml` dependencies
- [ ] Remove `common/infrastructure/persistence/mongodb.py` (if no longer used)
- [ ] Remove MongoDB-specific code from all migrated repositories
- [ ] Remove `MONGO_PROJECT_DATABASE`, `MONGO_USER_DATABASE` from settings (keep `MONGO_SENSOR_DATABASE`)
- [ ] Update `init_mongodb.py` if needed
- [ ] Remove `mongodb_backend` service from docker-compose if sensors are migrated too (not in this phase)

## Open Items (Future Work)

- [ ] Migrate sensor data from MongoDB to Postgres (separate effort)
- [ ] Remove MongoDB container entirely once sensors are migrated
- [ ] Consider connection pooling configuration for production
- [ ] Add database health check endpoint for Postgres

## Risk Matrix

| Risk                                            | Probability | Impact | Mitigation                                                                                   |
|-------------------------------------------------|-------------|--------|----------------------------------------------------------------------------------------------|
| JSON query incompatibility (SQLite vs Postgres) | High        | Medium | Use dialect-agnostic SQLAlchemy JSON functions; avoid Postgres-specific `->`/`->>` operators |
| Module-level singletons not all captured        | Medium      | High   | Full code search for repo imports; comprehensive test suite                                  |
| Transaction deadlocks with concurrent writes    | Low         | High   | Use `SELECT ... FOR UPDATE` where needed; keep transactions short                            |
| Sensor tests break without MongoDB              | High        | Low    | `@pytest.mark.mongo` marker; separate CI target                                              |
| Alembic migration not idempotent                | Medium      | High   | Test migration multiple times in dev; use `compare_type=True`                                |
| Postgres connection pool exhaustion             | Low         | High   | Configure `pool_size` and `max_overflow`                                                     |

## Success Criteria

- [ ] `make start-dev` starts Postgres container
- [ ] `flask run` connects to Postgres
- [ ] `pytest` runs without MongoDB (excluding sensor tests)
- [ ] Event store writes to `project_events` table
- [ ] Projections write to respective Postgres tables
- [ ] Transaction boundary: event + projection commit atomically
- [ ] Alembic migration works in dev
- [ ] Sensor module still works with MongoDB
- [ ] All existing tests pass with new architecture
