# Morpheus Project - Package Upgrade Analysis

**Date**: 2026-02-02
**Current Working Directory**: `/Users/ralf/Projects/inowas/morpheus/src/frontend`

---

## Executive Summary

This document provides a comprehensive analysis of the Morpheus full-stack application, identifying outdated packages and proposing a phased upgrade strategy. The project is several years old and requires careful, incremental updates to modernize its technology stack while minimizing risk.

---

## Project Overview

### Architecture

**Morpheus** is a full-stack groundwater modeling and decision support system (DSS) built by INOWAS, featuring:

- **Backend**: Flask-based REST API (Python 3.12+)
- **Frontend**: Three React 18.2 applications:
  - Morpheus (main application)
  - MfViz (MODFLOW visualizer)
  - SimpleTools (utilities)
- **Infrastructure**: Docker-based deployment
- **Authentication**: Keycloak identity server
- **Data Storage**: MongoDB 7.0 (primary), PostgreSQL 13 (Keycloak)
- **Task Queue**: Celery with RabbitMQ

### Technology Stack

#### Frontend Core
- React 18.2.0 with TypeScript 5.4.2
- Webpack 5.90.3 (build tool)
- Redux Toolkit 2.2.1 (state management)
- Node.js 20.9.0 (.nvmrc specification)

#### Key Frontend Libraries
- **Mapping**: Leaflet 1.9.4, React-Leaflet 4.2.1
- **UI**: Semantic UI React 2.1.5
- **Visualization**: VTK.js 29.9.0, Recharts 2.12.7
- **Authentication**: OIDC Client TS 3.0.1
- **Internationalization**: i18next 23.10.1
- **Testing**: Jest 29.7.0, Testing Library

#### Backend Core
- Flask 3.0.1 with Gunicorn 21.2.0
- Python 3.12+ (system has 3.14.2)
- Celery 5.3.6 (task queue)
- SQLAlchemy 2.0.25

#### Key Backend Libraries
- **Groundwater Modeling**: FloPy 3.7.0 (MODFLOW integration)
- **Geospatial**: GeoPandas 0.14.2, Shapely 2.0.2, pyproj 3.6.1
- **Database**: pymongo 4.6.1, psycopg2 2.9.9
- **Configuration**: Dynaconf 3.2.4
- **Authentication**: python-keycloak 3.7.0
- **Data Processing**: pandas 2.2.0, scipy 1.12.0

---

## Current State Analysis

### Frontend Analysis

#### Version Status

| Category | Current | Latest | Status |
|----------|---------|--------|--------|
| **Node.js** | 20.9.0 (.nvmrc) | 22.19.0 (system) | ⚠️ Version mismatch |
| **React** | 18.2.0 | 19.2.4 | ⚠️ Major version available |
| **TypeScript** | 5.4.2 | 5.7.x | ✓ Minor updates |
| **Webpack** | 5.90.3 | 5.x | ✓ Minor updates |
| **Storybook** | 8.2.6 | 8.6.15 | ✓ Patch updates |

#### Critical Package Updates Required

**Major Version Updates (Breaking Changes Expected)**

| Package | Current | Latest | Breaking Changes Risk |
|---------|---------|--------|---------------------|
| `react` / `react-dom` | 18.2.0 | 19.2.4 | 🔴 High - New concurrent features, JSX changes |
| `@fortawesome/react-fontawesome` | 0.2.0 | 3.1.1 | 🔴 High - API redesign |
| `@sentry/react` | 7.107.0 | 10.38.0 | 🟡 Medium - Config changes |
| `i18next` | 23.10.1 | 25.8.0 | 🟡 Medium - API updates |
| `react-i18next` | 14.1.0 | 16.5.4 | 🟡 Medium - Follows i18next |
| `mathjs` | 13.0.2 | 15.1.0 | 🟡 Medium - Math operations |
| `rc-slider` | 10.5.0 | 11.1.9 | 🟡 Medium - UI component |
| `react-datepicker` | 6.4.0 | 9.1.0 | 🟡 Medium - Date handling |
| `@kitware/vtk.js` | 29.9.0 | 34.16.3 | 🟡 Medium - Visualization |
| `react-date-range` | 1.4.0 | 2.0.1 | 🟡 Medium - Date component |

**Minor/Patch Updates (Lower Risk)**

- `axios`: 1.6.8 → 1.13.4
- `luxon`: 3.4.4 → 3.7.2
- `@reduxjs/toolkit`: 2.2.1 → 2.11.2
- `@turf/turf`: 7.0.0 → 7.3.3
- `browserslist`: 4.23.0 → 4.28.1
- `oidc-client-ts`: 3.0.1 → 3.4.1
- `papaparse`: 5.4.1 → 5.5.3

**Deprecated Packages**

- `i18next-xhr-backend` (3.2.2) - Should migrate to `i18next-http-backend`
- `moment` (2.30.1) - Consider migrating to luxon or date-fns (already using luxon 3.4.4)

#### Development Dependencies

**Testing & Quality Tools**
- ESLint: 8.57.0 → 9.x (major rewrite to flat config)
- TypeScript ESLint: 7.6.0 (update available)
- Testing Library packages (relatively current)
- Jest 29.7.0 (current)

**Build Tools**
- Babel ecosystem (7.24.x) - minor updates available
- Webpack plugins - various updates available
- CSS/Less loaders - minor updates

### Backend Analysis

#### Version Status

| Category | Current | Latest | Status |
|----------|---------|--------|--------|
| **Python** | 3.12+ (req) | 3.14.2 (system) | ⚠️ Newer version on system |
| **Flask** | 3.0.1 | 3.1.x | ✓ Minor updates |
| **Celery** | 5.3.6 | 5.4.x | ✓ Minor updates |
| **SQLAlchemy** | 2.0.25 | 2.0.x | ✓ Patch updates |

#### Critical Package Updates

**Major Version Updates**

| Package | Current | Latest | Risk Level |
|---------|---------|--------|-----------|
| `geopandas` | 0.14.2 | 1.0+ | 🔴 High - Major spatial data changes |
| `Flask` | 3.0.1 | 3.1.x | 🟢 Low - Stable API |
| `Celery` | 5.3.6 | 5.4.x | 🟢 Low - Minor update |

**Stable/Current Packages**
- `flopy`: 3.7.0 (MODFLOW - stable, domain-specific)
- `shapely`: 2.0.2 (current)
- `pymongo`: 4.6.1 (current 4.x series)
- `pandas`: 2.2.0 (current)
- `scipy`: 1.12.0 (current)
- `python-keycloak`: 3.7.0 (current)

**Development Dependencies**
- `pytest` ecosystem (if used - check requirements/test.txt)
- Jupyter/JupyterLab: 4.0.11 → 4.x updates available
- `matplotlib`: 3.9.0 (current)

### Infrastructure Analysis

#### Docker Images

| Service | Current | Latest Available | Priority |
|---------|---------|-----------------|----------|
| **Traefik** | 2.10 | 3.x | 🟡 Medium - Major version |
| **Nginx** | 1.25.2-alpine | 1.27.x | 🟢 Low - Minor update |
| **MongoDB** | 7.0 | 7.0.x/8.0 | 🟢 Low - Stable |
| **PostgreSQL** | 13 | 16/17 | 🟡 Medium - Several major versions behind |
| **RabbitMQ** | (not specified) | 4.x | 🟢 Check current version |
| **Keycloak** | (custom) | 26.x | 🟡 Check version in custom build |

---

## Risk Assessment

### High Risk Items

#### 1. React 18 → 19 Migration 🔴
**Impact**: Core framework - affects entire frontend application

**Breaking Changes**:
- New JSX transform requirements
- Changes to automatic batching behavior
- Concurrent rendering updates
- `React.FC` type changes
- Removal of deprecated lifecycle methods
- Changes to `ref` handling

**Migration Effort**: High (2-4 weeks)
- Update all three apps (Morpheus, MfViz, SimpleTools)
- Test all user interactions
- Update testing strategies
- Fix type errors

**Dependencies Blocked**: Many React ecosystem packages require React 19 updates first

#### 2. Node.js Version Alignment 🔴
**Impact**: Build system, developer environment

**Issues**:
- .nvmrc specifies 20.9.0
- System running 22.19.0
- Potential npm/build tool compatibility issues

**Resolution**:
- Update .nvmrc to Node 22.x LTS
- Test all build configurations
- Update CI/CD pipelines

#### 3. FontAwesome v0.2 → v3.1 🔴
**Impact**: Icon system used throughout UI

**Breaking Changes**:
- Complete API redesign
- Import path changes
- Icon name changes
- TypeScript definitions updated

**Migration Effort**: Medium (1-2 weeks)
- Find and replace icon imports
- Update icon usage patterns
- Test visual consistency

#### 4. Sentry v7 → v10 🟡
**Impact**: Error tracking and monitoring

**Breaking Changes**:
- SDK initialization changes
- Configuration API updates
- Integration setup modified
- Performance monitoring changes

**Migration Effort**: Medium (3-5 days)
- Update initialization code
- Test error reporting
- Verify source maps

### Medium Risk Items

#### 5. i18next Ecosystem (v23 → v25) 🟡
**Impact**: Internationalization across all apps

**Changes**:
- API updates
- Plugin system changes
- Backend loader migration needed (`i18next-xhr-backend` deprecated)

**Migration Effort**: Medium (1 week)
- Update to `i18next-http-backend`
- Test all language files
- Verify translation loading

#### 6. GeoPandas v0.14 → v1.0+ 🟡
**Impact**: Spatial data processing in backend

**Breaking Changes**:
- API stabilization (1.0 release)
- Coordinate system handling
- Geometry operations

**Migration Effort**: Medium (1-2 weeks)
- Review spatial operations
- Test GIS functionality
- Validate coordinate transformations

#### 7. Date/Time Libraries 🟡
**Impact**: Multiple components handling dates

**Packages**:
- `react-datepicker`: 6.4.0 → 9.1.0
- `react-date-range`: 1.4.0 → 2.0.1
- `luxon`: 3.4.4 → 3.7.2
- `moment`: 2.30.1 (consider removing)

**Migration Effort**: Medium (1 week)
- Test date pickers
- Verify timezone handling
- Consider consolidating on luxon

### Low Risk Items

#### 8. Minor Package Updates 🟢
**Packages with minor/patch updates**:
- axios, lodash utilities, Redux Toolkit
- Testing libraries, build tools
- Most Python backend packages

**Migration Effort**: Low (2-3 days)
- Bulk update
- Run test suites
- Quick smoke testing

#### 9. Docker Base Images 🟢
**Updates**:
- Nginx: 1.25.2 → 1.27.x
- MongoDB: Keep on 7.0.x
- Consider PostgreSQL 13 → 15+ for Keycloak

**Migration Effort**: Low (1-2 days)
- Update Dockerfiles
- Test container builds
- Verify service functionality

---

## Recommended Upgrade Strategy

### Phased Approach Overview

A systematic, incremental approach minimizes risk and allows for thorough testing at each stage.

```
Phase 1: Foundation (2-3 weeks)
    ↓
Phase 2: Minor Updates (1-2 weeks)
    ↓
Phase 3: Major Dependencies (3-4 weeks)
    ↓
Phase 4: React 19 Migration (3-4 weeks)
    ↓
Phase 5: Infrastructure (1-2 weeks)
```

**Total Estimated Timeline**: 10-15 weeks (with buffer for issues)

---

### Phase 1: Foundation & Tooling

**Goal**: Update development environment and build tools without touching application code.

**Duration**: 2-3 weeks

#### 1.1 Node.js Version Management
```bash
# Update .nvmrc
echo "22.19.0" > .nvmrc

# Or use latest LTS
echo "22" > .nvmrc

# Update CI/CD pipelines to use Node 22
```

**Files to Update**:
- `/src/frontend/.nvmrc`
- `.gitlab-ci.yml` (if using GitLab CI)
- Dockerfile.morpheus, Dockerfile.mfviz, Dockerfile.simpletools
- Documentation

**Testing**:
- [ ] Local build succeeds
- [ ] CI/CD pipeline builds
- [ ] All three apps build successfully
- [ ] Webpack dev server runs

#### 1.2 TypeScript Update
```bash
cd src/frontend
npm install typescript@^5.7 --save-dev
```

**Tasks**:
- Update TypeScript to 5.7.x
- Fix any new strict mode errors
- Update @types/* packages
- Review tsconfig.json for new options

**Testing**:
- [ ] No type errors in build
- [ ] IDE integration works
- [ ] Type checking in CI passes

#### 1.3 Build Tools
```bash
# Update Webpack and plugins
npm install webpack@^5.96 webpack-cli@^5 webpack-dev-server@^5 --save-dev

# Update Babel ecosystem
npm install @babel/core@^7.26 @babel/preset-env@^7.26 @babel/preset-react@^7.26 --save-dev

# Update loaders
npm install babel-loader@^9 css-loader@^6 style-loader@^3 less-loader@^12 --save-dev
```

**Testing**:
- [ ] Development server runs
- [ ] Production builds complete
- [ ] Bundle sizes reasonable
- [ ] Source maps work
- [ ] Hot module replacement works

#### 1.4 Testing & Linting Tools

**ESLint Migration** (Major - flat config):
```bash
# ESLint 9 uses flat config
npm install eslint@^9 @eslint/js --save-dev
npm install typescript-eslint@^8 --save-dev
```

**Create new** `eslint.config.js`:
```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // Migrate rules from .eslintrc
    }
  }
];
```

**Jest/Testing Library**:
```bash
# Update testing tools
npm install jest@^29 @testing-library/react@^16 @testing-library/jest-dom@^6 --save-dev
```

**Tasks**:
- [ ] Migrate .eslintrc to eslint.config.js
- [ ] Update Jest configuration
- [ ] Run and fix linting issues
- [ ] Ensure all tests pass

#### 1.5 Storybook Update
```bash
npm install storybook@^8.6 --save-dev
npx storybook@latest upgrade
```

**Testing**:
- [ ] Storybook builds and runs
- [ ] All stories render
- [ ] Addons work correctly

---

### Phase 2: Minor & Patch Updates

**Goal**: Update packages with minimal breaking changes to reduce technical debt.

**Duration**: 1-2 weeks

#### 2.1 Frontend Minor Updates

**Low-Risk Package Updates**:
```json
{
  "dependencies": {
    "axios": "^1.13.4",
    "browserslist": "^4.28.1",
    "luxon": "^3.7.2",
    "@reduxjs/toolkit": "^2.11.2",
    "@turf/turf": "^7.3.3",
    "history": "^5.3.0",
    "oidc-client-ts": "^3.4.1",
    "papaparse": "^5.5.3",
    "recharts": "^2.12.7",
    "uuid": "^9.0.1"
  }
}
```

**Update Process**:
```bash
cd src/frontend

# Update packages one category at a time
npm install axios@^1.13.4 browserslist@^4.28.1 luxon@^3.7.2

# Run tests after each batch
npm run test:ci

# Test builds
npm run build-morpheus
npm run build-mfviz
npm run build-simpletools
```

**Testing Checklist**:
- [ ] API calls work (axios)
- [ ] Authentication flows (oidc-client-ts)
- [ ] State management (Redux Toolkit)
- [ ] Charts render (recharts)
- [ ] Date handling (luxon)
- [ ] CSV parsing (papaparse)
- [ ] Geospatial operations (@turf/turf)

#### 2.2 Backend Minor Updates

**Update Python Packages**:
```bash
cd src/backend

# Update to latest patch versions
pip install --upgrade flask celery sqlalchemy pandas scipy
```

**Requirements Update**:
```txt
# requirements/prod.txt updates
Flask==3.1.0
celery==5.4.0
SQLAlchemy==2.0.36
pandas==2.2.3
scipy==1.14.1
pymongo==4.10.1
```

**Testing**:
- [ ] Flask app starts
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Celery tasks execute
- [ ] Spatial operations succeed

#### 2.3 Docker Base Image Updates

**Update Nginx**:
```dockerfile
# src/frontend/docker/Dockerfile.morpheus
FROM nginx:1.27-alpine
```

**Update Traefik** (if ready):
```yaml
# infrastructure/local/docker-compose.yml
traefik:
  image: traefik:3.2
```

**Testing**:
- [ ] Containers build
- [ ] Services start
- [ ] Routing works
- [ ] Health checks pass

---

### Phase 3: Major Dependencies (Pre-React)

**Goal**: Update major versions of non-React packages to prepare for React 19.

**Duration**: 3-4 weeks

#### 3.1 i18next Ecosystem Migration

**Current State**:
- `i18next`: 23.10.1 → 25.8.0
- `react-i18next`: 14.1.0 → 16.5.4
- `i18next-xhr-backend`: 3.2.2 (deprecated)

**Migration Steps**:

1. **Replace deprecated backend**:
```bash
npm uninstall i18next-xhr-backend
npm install i18next-http-backend@^2.6.2
```

2. **Update initialization code**:
```typescript
// Before (src/*/i18n.ts)
import XHR from 'i18next-xhr-backend';

i18next
  .use(XHR)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

// After
import HttpBackend from 'i18next-http-backend';

i18next
  .use(HttpBackend)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

3. **Update core packages**:
```bash
npm install i18next@^25.8 react-i18next@^16.5 i18next-browser-languagedetector@^8.2
```

4. **Test translation loading**:
- [ ] All languages load
- [ ] Namespace loading works
- [ ] Language detection functions
- [ ] Dynamic imports work

**Breaking Changes to Address**:
- API method signature changes
- Plugin registration updates
- Type definitions updates

#### 3.2 Sentry SDK Update (v7 → v10)

**Update Packages**:
```bash
npm install @sentry/react@^10.38 @sentry/tracing@^10.38
```

**Migration Steps**:

1. **Update initialization**:
```typescript
// Before
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "...",
  integrations: [
    new Integrations.BrowserTracing()
  ],
  tracesSampleRate: 1.0,
});

// After (v10)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "...",
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  tracesSampleRate: 1.0,
});
```

2. **Update error boundaries**:
```typescript
// Check all Sentry.ErrorBoundary usages
<Sentry.ErrorBoundary fallback={ErrorFallback}>
  <App />
</Sentry.ErrorBoundary>
```

**Testing**:
- [ ] Errors are captured
- [ ] Source maps work
- [ ] Performance monitoring works
- [ ] User context captured
- [ ] Breadcrumbs recorded

#### 3.3 Date/Time Libraries Consolidation

**Current State**:
- Using both `luxon` (3.4.4) and `moment` (2.30.1)
- Date pickers: `react-datepicker` (6.4.0), `react-date-range` (1.4.0)

**Strategy**: Standardize on luxon, update date pickers

1. **Update luxon**:
```bash
npm install luxon@^3.7
```

2. **Update date pickers**:
```bash
npm install react-datepicker@^9.1 react-date-range@^2.0
```

3. **Remove moment** (if possible):
```bash
# Audit moment usage
npm why moment

# If only used by dependencies, may need to wait
# If used in code, migrate to luxon
```

**Migration Script** (example):
```typescript
// Before (moment)
import moment from 'moment';
const date = moment('2024-01-01').format('YYYY-MM-DD');

// After (luxon)
import { DateTime } from 'luxon';
const date = DateTime.fromISO('2024-01-01').toISODate();
```

**Testing**:
- [ ] Date pickers function
- [ ] Date formatting correct
- [ ] Timezone handling works
- [ ] Date calculations accurate

#### 3.4 Visualization Libraries

**VTK.js Update** (29.9.0 → 34.16.3):
```bash
npm install @kitware/vtk.js@^34.16
```

**Impact**: 3D visualization in MfViz app

**Testing Focus**:
- [ ] 3D rendering works
- [ ] MODFLOW visualization displays
- [ ] Performance acceptable
- [ ] Interactions function

**MathJS Update** (13.0.2 → 15.1.0):
```bash
npm install mathjs@^15.1
```

**Testing**:
- [ ] Mathematical calculations correct
- [ ] Unit conversions work
- [ ] Matrix operations function

#### 3.5 UI Component Updates

**RC Slider** (10.5.0 → 11.1.9):
```bash
npm install rc-slider@^11.1 rc-tooltip@^6.4
```

**Testing**:
- [ ] Sliders render
- [ ] Value changes work
- [ ] Touch interactions function
- [ ] Styling correct

**Semantic UI** (check for updates):
```bash
npm install semantic-ui-react@latest semantic-ui-less@latest
```

#### 3.6 Backend: GeoPandas Major Update

**Update GeoPandas**:
```bash
pip install geopandas==1.0.*
```

**Breaking Changes in 1.0**:
- API stabilization
- Deprecated methods removed
- Coordinate reference system handling

**Migration Steps**:

1. **Review spatial operations** in:
   - `/src/backend/src/morpheus/project/`
   - `/src/backend/src/morpheus/sensor/`

2. **Update CRS handling**:
```python
# Before
gdf.crs = 'EPSG:4326'

# After (1.0)
gdf.crs = 'EPSG:4326'  # Should still work, but check warnings
```

3. **Check deprecation warnings**:
```bash
python -W all -m pytest
```

**Testing**:
- [ ] Spatial data imports work
- [ ] Coordinate transformations correct
- [ ] GeoJSON exports valid
- [ ] Boundary calculations accurate
- [ ] Integration with shapely/pyproj works

---

### Phase 4: React 19 Migration

**Goal**: Upgrade React core and ecosystem to version 19.

**Duration**: 3-4 weeks

**⚠️ WARNING**: This is the highest risk phase. Ensure comprehensive testing.

#### 4.1 Pre-Migration Preparation

**Audit Current Usage**:
```bash
# Find deprecated patterns
grep -r "componentWillMount" src/
grep -r "componentWillReceiveProps" src/
grep -r "React.FC<" src/
grep -r "defaultProps" src/
```

**Check React 18 Features**:
- Ensure using `createRoot` (not `ReactDOM.render`)
- Review concurrent features usage
- Check Suspense boundaries
- Review error boundaries

#### 4.2 Update React Core

**Update React**:
```bash
cd src/frontend
npm install react@^19 react-dom@^19
```

**Update React Ecosystem**:
```bash
npm install react-redux@^9 react-router-dom@^6
npm install @types/react@^19 @types/react-dom@^19
```

#### 4.3 Update React Libraries

**React-Leaflet**: Check compatibility
```bash
npm install react-leaflet@latest @react-leaflet/core@latest
```

**React DnD**:
```bash
npm install react-dnd@^16 react-dnd-html5-backend@^16
```

**Other React Components**:
```bash
npm install \
  react-oidc-context@latest \
  react-device-detect@latest \
  react-lazy-load-image-component@latest \
  react-movable@latest \
  react-qr-code@latest \
  react-vtk-js@latest
```

#### 4.4 Breaking Changes to Address

**1. TypeScript Types**:
```typescript
// Before (React 18)
const Component: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

Component.defaultProps = {
  children: null
};

// After (React 19)
const Component = ({ children }: Props) => {
  return <div>{children}</div>;
};

// Or with default parameters
const Component = ({ children = null }: Props) => {
  return <div>{children}</div>;
};
```

**2. Ref Handling**:
```typescript
// Before
React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

// After (React 19 - ref is a prop)
function Component({ ref, ...props }: Props & { ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref}>{props.children}</div>;
}
```

**3. Context API**:
```typescript
// Ensure using modern context API
const MyContext = React.createContext<ContextType>(defaultValue);

// Use hooks
const value = useContext(MyContext);
```

#### 4.5 Update Testing

**Update Testing Library**:
```bash
npm install @testing-library/react@^16 @testing-library/react-hooks@latest
```

**Update Tests for React 19**:
- Review async rendering tests
- Update act() usage if needed
- Check Suspense testing
- Verify error boundary tests

#### 4.6 FontAwesome Migration

**Update FontAwesome** (v0.2 → v3.1):
```bash
npm install \
  @fortawesome/fontawesome-svg-core@^7 \
  @fortawesome/free-solid-svg-icons@^7 \
  @fortawesome/react-fontawesome@^3
```

**Migration Script**:
```typescript
// Before (v0.2)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faUser} />

// After (v3)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faUser} />  // API similar, check docs
```

**Find All Icon Usage**:
```bash
grep -r "FontAwesomeIcon" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@fortawesome" src/ --include="*.tsx" --include="*.ts"
```

**Testing**:
- [ ] All icons display
- [ ] Icon sizing works
- [ ] Colors apply correctly
- [ ] Animations function
- [ ] Performance acceptable

#### 4.7 Build All Three Apps

```bash
# Clean build
rm -rf node_modules dist
npm install

# Build each app
npm run build-morpheus
npm run build-mfviz
npm run build-simpletools

# Check bundle sizes
npm run analyze-morpheus
```

**Bundle Size Comparison**:
- Document before/after sizes
- Investigate significant increases
- Consider code splitting improvements

#### 4.8 Comprehensive Testing

**Automated Testing**:
```bash
# Run all tests
npm run test:ci

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

**Manual Testing Checklist**:

**Morpheus App**:
- [ ] Login/authentication
- [ ] Project creation
- [ ] Map interactions (panning, zooming)
- [ ] Drawing tools (@geoman-io)
- [ ] Layer toggles
- [ ] Data import/export
- [ ] Model configuration
- [ ] Model execution
- [ ] Results visualization
- [ ] Charts and graphs
- [ ] User settings
- [ ] Language switching
- [ ] Responsive design

**MfViz App**:
- [ ] Model loading
- [ ] 3D visualization
- [ ] Time stepping
- [ ] Layer visualization
- [ ] Cross-sections
- [ ] Data export

**SimpleTools App**:
- [ ] Tool selection
- [ ] Parameter inputs
- [ ] Calculations
- [ ] Results display

---

### Phase 5: Infrastructure Updates

**Goal**: Update Docker images and infrastructure components.

**Duration**: 1-2 weeks

#### 5.1 PostgreSQL Update (Keycloak)

**Current**: PostgreSQL 13
**Target**: PostgreSQL 15 or 16

**Steps**:
1. Backup current database
2. Update docker-compose.yml
3. Test migration path
4. Update Keycloak configuration if needed

**Testing**:
- [ ] Keycloak starts
- [ ] User authentication works
- [ ] Realms load correctly
- [ ] Client configurations intact

#### 5.2 Traefik v2 → v3 Migration

**Breaking Changes**:
- Configuration syntax changes
- Middleware updates
- Certificate resolution

**Migration**:
```yaml
# Update docker-compose.yml
traefik:
  image: traefik:3.2
  # Update command configuration for v3 syntax
```

**Resources**:
- [Traefik v3 Migration Guide](https://doc.traefik.io/traefik/migration/v2-to-v3/)

**Testing**:
- [ ] Routing works
- [ ] SSL/TLS certificates
- [ ] Middleware functions
- [ ] Dashboard access

#### 5.3 MongoDB Version Check

**Current**: 7.0

**Action**: Keep on 7.0.x, apply patch updates only
- MongoDB 8.0 available but major version
- Defer until stable and tested

#### 5.4 Update CI/CD Pipeline

**Update .gitlab-ci.yml** (or CI config):
```yaml
# Update Node version
frontend-build:
  image: node:22-alpine

# Update Python version
backend-test:
  image: python:3.12-slim
```

**Testing**:
- [ ] Pipeline runs successfully
- [ ] All stages pass
- [ ] Artifacts generated
- [ ] Docker images build

---

## Testing Strategy

### Automated Testing

#### Unit Tests
```bash
# Frontend
cd src/frontend
npm run test:ci
npm run test:coverage

# Backend
cd src/backend
pytest --cov=morpheus tests/
```

**Coverage Targets**:
- Maintain or improve existing coverage
- Critical paths: 90%+ coverage
- Overall: 70%+ coverage

#### Integration Tests
```bash
# API integration tests
pytest tests/integration/

# Frontend E2E
npm run test:e2e
```

#### Visual Regression Testing
```bash
# Storybook visual tests
npm run build-storybook
# Consider adding Chromatic or Percy
```

### Manual Testing

#### Smoke Tests (After Each Phase)
1. Application starts without errors
2. Login flow works
3. Basic navigation functions
4. API calls succeed
5. No console errors

#### Full Testing (After Phase 4)
1. **Authentication**: Login, logout, session management
2. **Projects**: Create, load, save, delete
3. **Mapping**: All map interactions, drawing tools
4. **Modeling**: Configuration, execution, results
5. **Data Import/Export**: All formats
6. **Visualizations**: Charts, 3D views, animations
7. **Responsive**: Mobile, tablet, desktop
8. **Browser Compatibility**: Chrome, Firefox, Safari, Edge

### Performance Testing

#### Metrics to Track
- **Page Load Time**: First contentful paint, largest contentful paint
- **Bundle Sizes**: Compare before/after for each app
- **Memory Usage**: Check for leaks, especially in 3D viz
- **API Response Times**: Ensure no regression

#### Tools
```bash
# Bundle analysis
npm run analyze-morpheus

# Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

---

## Rollback Plan

### Version Control Strategy

**Branching**:
```
main
 ├── upgrade/phase-1-foundation
 ├── upgrade/phase-2-minor-updates
 ├── upgrade/phase-3-major-deps
 ├── upgrade/phase-4-react19
 └── upgrade/phase-5-infrastructure
```

**Each branch**:
- Includes full working state
- Passes all tests
- Documented changes
- Can be deployed independently (where possible)

### Rollback Procedures

**If Phase Fails**:
1. **Document the issue**: Error logs, screenshots, reproduction steps
2. **Revert**: Merge previous stable branch
3. **Investigate**: Root cause analysis
4. **Fix**: Address issues in separate branch
5. **Retry**: Merge fix and retry phase

**Quick Rollback**:
```bash
# Revert to previous stable state
git checkout main
git reset --hard upgrade/phase-N-1
git push --force
```

---

## Dependencies Between Phases

### Critical Path

```
Phase 1 (Foundation)
    ├─ Required for Phase 2 (build tools)
    ├─ Required for Phase 3 (newer Node for packages)
    └─ Required for Phase 4 (TypeScript, build system)

Phase 2 (Minor Updates)
    ├─ Can run parallel to Phase 1 backend items
    └─ Reduces conflicts in Phase 3

Phase 3 (Major Deps)
    ├─ Must complete before Phase 4
    ├─ i18next needed before React 19 i18n packages
    └─ Sentry needed before React 19 Sentry integration

Phase 4 (React 19)
    ├─ Blocks no other phases
    └─ Highest risk, most time

Phase 5 (Infrastructure)
    ├─ Can run parallel to Phases 1-3
    └─ Should complete after Phase 4 for full testing
```

### Parallel Opportunities

**Can Run Concurrently**:
- Phase 1 backend + Phase 1 frontend (different contexts)
- Phase 2 backend + Phase 2 frontend (different codebases)
- Phase 5 (infrastructure) + Phase 1-3 (application code)

**Must Run Sequentially**:
- Phase 3 → Phase 4 (React ecosystem depends on i18next, Sentry)
- Phase 1 → Phase 4 (build tools must be updated first)

---

## Resource Requirements

### Team Composition

**Recommended**:
- **1 Senior Full-Stack Developer**: Leads migration, handles complex issues
- **1 Frontend Developer**: React migration, testing
- **1 Backend Developer**: Python updates, GeoPandas
- **1 DevOps Engineer**: Infrastructure, CI/CD, Docker (part-time)
- **1 QA Engineer**: Testing coordination, manual testing (part-time)

### Time Allocation

**Developer Time** (per phase):
- Phase 1: 80 hours (2 weeks × 2 devs)
- Phase 2: 40 hours (1 week × 2 devs)
- Phase 3: 120 hours (3 weeks × 2 devs)
- Phase 4: 160 hours (4 weeks × 2 devs)
- Phase 5: 40 hours (1 week × 1 dev)

**QA Time**:
- Continuous: 20 hours/week
- Phase 4 intensive: 40 hours/week

### Infrastructure

**Development**:
- Local dev environments (existing)
- CI/CD pipeline capacity
- Testing environments

**Staging**:
- Full staging environment mirroring production
- Test data sets
- Performance testing tools

---

## Success Criteria

### Phase Completion Criteria

**Each phase must meet**:
- [ ] All automated tests pass
- [ ] No regressions in functionality
- [ ] Performance metrics maintained or improved
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Smoke tests pass
- [ ] Deployed to staging successfully

### Project Success Criteria

**Final acceptance**:
- [ ] All packages updated to target versions
- [ ] Zero critical vulnerabilities (npm audit, pip-audit)
- [ ] Test coverage maintained or improved
- [ ] Performance benchmarks met
- [ ] All three apps function correctly
- [ ] Production deployment successful
- [ ] User acceptance testing passed
- [ ] Documentation complete
- [ ] Team trained on changes

---

## Risk Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| React 19 breaking changes | High | High | Comprehensive testing, incremental updates, maintain rollback |
| GeoPandas spatial data issues | Medium | High | Extensive spatial operation testing, GIS validation |
| Build failures | Medium | Medium | Lock file management, staged updates |
| Performance degradation | Low | High | Benchmark testing, profiling, monitoring |
| Security vulnerabilities | Low | High | Regular audits, security scanning |

### Project Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Timeline overrun | Medium | Medium | Buffer time, parallel work, clear priorities |
| Resource unavailability | Low | High | Cross-training, documentation |
| Scope creep | Medium | Medium | Strict phase definitions, change control |
| Stakeholder misalignment | Low | Medium | Regular updates, demo sessions |

---

## Maintenance Post-Upgrade

### Ongoing Updates

**Regular Schedule**:
- **Weekly**: Security patches
- **Monthly**: Patch version updates
- **Quarterly**: Minor version updates
- **Annually**: Major version evaluation

### Monitoring

**Setup**:
- Dependency update notifications (Dependabot, Renovate)
- Security vulnerability scanning
- Performance monitoring
- Error tracking (Sentry)

### Documentation

**Maintain**:
- Package version changelog
- Architecture decision records
- Migration guides for future updates
- Troubleshooting guides

---

## Additional Recommendations

### 1. Dependency Management

**Consider**:
- **Renovate** or **Dependabot**: Automated dependency updates
- **npm-check-updates**: Regular dependency reviews
- **Lock files**: Strict lock file management

### 2. Code Quality

**Improvements**:
- Increase test coverage during refactoring
- Address technical debt while touching files
- Improve type safety (strict TypeScript)
- Add JSDoc comments for complex functions

### 3. Performance

**Optimize**:
- Code splitting (already configured?)
- Lazy loading for large components
- Bundle size monitoring
- Asset optimization

### 4. Security

**Enhance**:
- Regular security audits
- Content Security Policy
- Subresource Integrity
- Dependency vulnerability scanning

### 5. Developer Experience

**Improve**:
- Update IDE configurations
- Document new patterns
- Update contributing guidelines
- Create upgrade runbook

---

## Appendices

### Appendix A: Package Update Commands

**Complete Update Script** (after phases complete):

```bash
#!/bin/bash
# complete-frontend-update.sh

cd src/frontend

# Core
npm install react@19 react-dom@19 typescript@5.7

# Build tools
npm install webpack@5 webpack-cli@5 webpack-dev-server@5

# React ecosystem
npm install react-router-dom@6 @reduxjs/toolkit@2 react-redux@9

# UI components
npm install semantic-ui-react@2 @fortawesome/react-fontawesome@3

# Utilities
npm install axios@1 lodash@4 luxon@3

# Internationalization
npm install i18next@25 react-i18next@16 i18next-http-backend@2

# Visualization
npm install @kitware/vtk.js@34 recharts@2

# Dev dependencies
npm install @types/react@19 @types/react-dom@19 eslint@9
```

### Appendix B: Useful Commands

**Dependency Analysis**:
```bash
# List outdated packages
npm outdated

# Check for security vulnerabilities
npm audit
npm audit fix

# List all dependencies of a package
npm why <package-name>

# Check dependency tree
npm ls <package-name>

# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Backend**:
```bash
# List outdated Python packages
pip list --outdated

# Security check
pip-audit

# Update package
pip install --upgrade <package-name>

# Freeze current versions
pip freeze > requirements-snapshot.txt
```

### Appendix C: Reference Documentation

**React 19**:
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

**Major Package Migrations**:
- [i18next v25 Migration](https://www.i18next.com/misc/migration-guide)
- [Sentry v10 Migration](https://docs.sentry.io/platforms/javascript/migration/)
- [ESLint v9 Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [GeoPandas 1.0 Release](https://geopandas.org/en/stable/docs/user_guide/migration.html)

**Infrastructure**:
- [Traefik v3 Migration](https://doc.traefik.io/traefik/migration/v2-to-v3/)
- [PostgreSQL Upgrade Guide](https://www.postgresql.org/docs/current/upgrading.html)

### Appendix D: Contact & Support

**Package-Specific Issues**:
- Check GitHub issues for each package
- Review migration guides
- Consult Stack Overflow for common problems

**Vendor Support**:
- Sentry: Support portal for error tracking issues
- FontAwesome: Documentation and support forums

---

## Conclusion

This upgrade project represents a significant but necessary modernization of the Morpheus application stack. The phased approach minimizes risk while ensuring thorough testing at each stage.

**Key Success Factors**:
1. **Discipline**: Follow the phases, don't skip steps
2. **Testing**: Comprehensive testing at each stage
3. **Documentation**: Record issues and solutions
4. **Communication**: Regular stakeholder updates
5. **Flexibility**: Adapt plan as issues arise

**Timeline Summary**: 10-15 weeks total with proper resourcing.

**Next Steps**: Review this analysis with the team, adjust timeline and phases as needed, and begin with Phase 1 when ready.

---

**Document Version**: 1.0
**Last Updated**: 2026-02-02
**Author**: Project Analysis
**Status**: Ready for Review