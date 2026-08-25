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
- [x] Add behavior coverage for layer property editing.
- [x] Associate model setup labels with their inputs for accessible queries.
- [x] Add a Storybook fixture for layer property editing.
- [ ] Add behavior coverage for layer metadata/property editing and boundary editing.
- [x] Add behavior coverage for model setup grid properties and read-only mode.
- [x] Add behavior coverage for layer confinement editing.
- [x] Add a frontend dependency-cruiser CI gate.
- [ ] Associate model setup labels with their inputs for accessible queries.
- [x] Add behavior coverage for calculation state transitions.
- [ ] Add stories for project list, boundaries, and results.
- [x] Add stories for model setup and layer confinement.
- [x] Add a story for calculation states.
- [x] Add the Storybook test runner and run tagged interaction tests in CI with
  a browser-enabled image.
- [x] Add visual regression checks for deterministic Morpheus module screens;
  keep shared components, maps, charts, and network-dependent rendering outside
  the gate.
- [ ] Generate and commit canonical Linux snapshots for Morpheus from the
  Playwright CI image using `VISUAL_UPDATE_SNAPSHOTS=1` once.
- [ ] Raise frontend coverage thresholds only after behavior coverage exists.
- [ ] Use dependency-cruiser to prevent new cross-layer imports while
  refactoring.

## Test Rules

- Prefer user-visible behavior over implementation details.
- Mock network boundaries, not application behavior.
- Keep browser tests for a few critical journeys; keep most coverage in Jest.
- Make visual snapshots deterministic before adding them to a merge gate.
