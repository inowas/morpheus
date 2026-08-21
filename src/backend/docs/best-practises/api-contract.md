# API Contract

OpenAPI is the contract for the backend API.

- `src/morpheus/openapi.yml` is the bundled entry point.
- Module contracts live in `project/openapi.yml`, `sensor/openapi.yml`, and
  `user/openapi.yml`.
- Every registered API operation needs a matching OpenAPI operation.
- Trailing-slash aliases do not need separate OpenAPI paths.
- Run `make build-openapi-spec` after contract changes.

Before adding or changing a schema, inspect:

1. The route and request handler.
2. The returned value object or Pydantic model.
3. Existing tests and API behavior.

Do not invent response schemas when the handler contract is unclear. Document
the actual behavior first, then improve the contract in a separate change if
needed.
