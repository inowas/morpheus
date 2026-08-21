# API Contract

OpenAPI is the contract for the backend API.

- FastAPI's `app.openapi()` is the only API contract source.
- `/schema` serves the generated FastAPI document.
- Every registered API operation needs a matching FastAPI operation.
- Trailing-slash aliases do not need separate OpenAPI paths.

Before adding or changing a schema, inspect:

1. The route and request handler.
2. The returned value object or Pydantic model.
3. Existing tests and API behavior.

Do not invent response schemas when the handler contract is unclear. Document
the actual behavior first, then improve the contract in a separate change if
needed.
