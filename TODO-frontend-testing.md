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
- [x] Add a Storybook fixture for calculation states.

## Next

- [x] Add CI execution for the frontend Jest suite on every frontend change.
- [x] Replace the incomplete Puppeteer setup with Playwright and add a
  frontend smoke test against the built application.
- [x] Add project-list loading, empty state, and error behavior coverage.
- [x] Add behavior coverage for layer confinement editing.
- [ ] Add behavior coverage for layer metadata/property editing and boundary editing.
- [x] Add behavior coverage for model setup grid properties and read-only mode.
- [x] Add behavior coverage for layer confinement editing.
- [ ] Associate model setup labels with their inputs for accessible queries.
- [x] Add behavior coverage for calculation state transitions.
- [ ] Add stories for project list, model setup, layers, boundaries, and results.
- [x] Add a story for calculation states.
- [x] Add the Storybook test runner and run tagged interaction tests in CI with
  a browser-enabled image.
- [x] Add visual regression snapshots for stable screens; keep maps, charts,
  and other nondeterministic rendering outside the gate until fixed fixtures
  exist.
- [ ] Raise frontend coverage thresholds only after behavior coverage exists.
- [ ] Use dependency-cruiser to prevent new cross-layer imports while
  refactoring.

## Test Rules

- Prefer user-visible behavior over implementation details.
- Mock network boundaries, not application behavior.
- Keep browser tests for a few critical journeys; keep most coverage in Jest.
- Make visual snapshots deterministic before adding them to a merge gate.
