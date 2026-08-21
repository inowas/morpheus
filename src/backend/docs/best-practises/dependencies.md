# Dependencies

The supported backend runtime is Python 3.12.

When updating dependencies:

- Update `pyproject.toml` and `uv.lock` together.
- Use `uv lock --python 3.12` for lockfile resolution.
- Preserve constraints required for known compatibility issues.
- Do not combine package upgrades with framework migration changes.
- Run tests, Ruff, OpenAPI checks, and the relevant Docker build.
- Commit a coherent dependency change separately from application changes.

The current GeoTIFF stack uses `zarr==2.12.0` and requires `numcodecs<0.16`.
Do not remove that constraint without testing GeoTIFF imports and asset flows.

SQLAlchemy is already on the 2.x API. Do not upgrade it merely because a newer
release exists; upgrade it when there is a security fix, concrete bug, or
required compatibility change.
