# Frontend Testing Roadmap

Goal: make the frontend safe to refactor by protecting user-visible behavior
before changing architecture or state management.

## Done

- [x] Create a dedicated feature branch for frontend behavior and visual tests.
- [x] Add behavior coverage for unauthenticated login, authenticated redirect,
  and protected-route behavior.
- [x] Add behavior coverage for project-list ownership and search filtering.
- [x] Add behavior coverage for project-list navigation.
- [x] Add a Storybook interaction for project metadata validation.

## Next

- [x] Add CI execution for the frontend Jest suite on every frontend change.
- [x] Replace the incomplete Puppeteer setup with Playwright and add a
  frontend smoke test against the built application.
- [x] Add project-list loading, empty state, and error behavior coverage.
- [ ] Add behavior coverage for model setup, layer editing, boundary editing,
  and calculation state transitions.
- [ ] Add stories for the high-risk Morpheus screens: project list, model setup,
  layers, boundaries, calculations, and results.
- [x] Add the Storybook test runner and run tagged interaction tests in CI with
  a browser-enabled image.
- [ ] Add visual regression snapshots for stable screens and exclude maps,
  charts, and other nondeterministic rendering until they have fixed fixtures.
- [ ] Raise frontend coverage thresholds only after behavior coverage exists.
- [ ] Use dependency-cruiser to prevent new cross-layer imports while
  refactoring.

## Test Rules

- Prefer user-visible behavior over implementation details.
- Mock network boundaries, not application behavior.
- Keep browser tests for a few critical journeys; keep most coverage in Jest.
- Make visual snapshots deterministic before adding them to a merge gate.
