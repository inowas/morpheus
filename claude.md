# Claude Code - Morpheus Project Context

**Last Updated**: 2026-02-02
**Project**: Morpheus Full-Stack Groundwater Modeling DSS

---

## Project Overview

Morpheus is a full-stack **groundwater modeling and decision support system (DSS)** developed by INOWAS. It provides tools for hydrogeologists and water resource managers to create, configure, run, and visualize MODFLOW groundwater models.

### Core Functionality
- Groundwater flow modeling using MODFLOW (via FloPy)
- Interactive map-based model configuration
- Geospatial data import/export
- Sensor data integration
- 3D visualization of model results
- Multi-user collaboration
- Project management

---

## Architecture

### Monorepo Structure

```
/Users/ralf/Projects/inowas/morpheus/
├── src/
│   ├── backend/              # Python Flask API
│   ├── frontend/             # React applications (main focus)
│   ├── keycloak/             # Authentication server customization
│   └── cron/                 # Scheduled tasks
├── infrastructure/
│   ├── local/                # Docker Compose for local dev
│   └── production/           # Production deployment configs
├── UPGRADE_ANALYSIS.md       # Comprehensive upgrade plan
└── claude.md                 # This file
```

### Three Frontend Applications

1. **Morpheus** (main app): Full modeling application
   - Build: `npm run build-morpheus`
   - Dev: `npm run start-morpheus-integration-local`

2. **MfViz** (visualizer): 3D MODFLOW visualization
   - Build: `npm run build-mfviz`
   - Dev: `npm run start-mfviz`

3. **SimpleTools**: Standalone calculation tools
   - Build: `npm run build-simpletools`
   - Dev: `npm run start-simpletools`

---

## Technology Stack

### Frontend (Currently in /src/frontend)

**Core**:
- React 18.2.0 (upgrading to 19.x planned)
- TypeScript 5.4.2
- Webpack 5.90.3
- Node.js 20.9.0 (per .nvmrc)

**State & Routing**:
- Redux Toolkit 2.2.1
- React Router DOM 6.22.3

**Key Libraries**:
- Leaflet 1.9.4 (mapping)
- VTK.js 29.9.0 (3D visualization)
- Semantic UI React 2.1.5 (UI framework)
- i18next 23.10.1 (internationalization)
- oidc-client-ts 3.0.1 (authentication)
- Recharts 2.12.7 (charting)

**Testing**:
- Jest 29.7.0
- Testing Library
- Storybook 8.2.6

### Backend (in /src/backend)

**Core**:
- Python 3.12+
- Flask 3.0.1
- Gunicorn 21.2.0 (WSGI server)
- Celery 5.3.6 (async tasks)

**Key Libraries**:
- FloPy 3.7.0 (MODFLOW Python library)
- GeoPandas 0.14.2 (spatial data)
- pymongo 4.6.1 (MongoDB client)
- SQLAlchemy 2.0.25 (for PostgreSQL/Keycloak)
- python-keycloak 3.7.0

**Infrastructure**:
- MongoDB 7.0 (primary database)
- PostgreSQL 13 (Keycloak)
- RabbitMQ (message broker)
- Traefik 2.10 (reverse proxy)
- Keycloak (identity/auth)

---

## Current Status: Package Upgrade Project

### Status: Planning Phase

A comprehensive package upgrade is planned to modernize the stack. See **UPGRADE_ANALYSIS.md** for full details.

### Key Upgrade Targets

**Frontend**:
- React 18.2 → 19.x (major breaking changes)
- Node.js 20.9 → 22.x LTS
- TypeScript 5.4 → 5.7
- Many major package updates (Sentry, i18next, FontAwesome, etc.)

**Backend**:
- GeoPandas 0.14 → 1.0 (major version)
- Minor updates to Flask, Celery, other packages

**Infrastructure**:
- Traefik 2.10 → 3.x
- PostgreSQL 13 → 15/16

### Upgrade Phases

1. **Phase 1**: Foundation & Tooling (Node, TypeScript, build tools)
2. **Phase 2**: Minor package updates
3. **Phase 3**: Major dependencies (i18next, Sentry, date libs, GeoPandas)
4. **Phase 4**: React 19 migration (highest risk)
5. **Phase 5**: Infrastructure updates

**Estimated Timeline**: 10-15 weeks with proper resourcing

---

## Important Patterns & Conventions

### Frontend Code Organization

**Domain-Driven Structure** (in backend):
```
src/backend/src/morpheus/<domain>/
├── application/      # Application services (use cases)
├── domain/          # Business logic, entities
├── infrastructure/  # External dependencies, repositories
├── presentation/    # API controllers, serialization
└── types/           # Domain models, value objects
```

**Frontend Structure**:
```
src/frontend/src/
├── morpheus/        # Main app
├── mfviz/           # Visualizer app
├── simpletools/     # Tools app
└── common/          # Shared code
```

### Configuration Files

**Frontend** (`/src/frontend/`):
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `webpack.config.morpheus.ts` - Morpheus build config
- `webpack.config.mfviz.ts` - MfViz build config
- `webpack.config.simpletools.ts` - SimpleTools build config
- `.eslintrc` - Linting rules
- `.nvmrc` - Node version (20.9.0)

**Backend** (`/src/backend/`):
- `pyproject.toml` - Python project configuration and dependencies (uv/pip compatible)
- `requirements/prod.txt` - Production requirements (for backward compatibility)
- `requirements/dev.txt` - Development requirements (for backward compatibility)
- `requirements/test.txt` - Testing requirements (for backward compatibility)
- `src/morpheus/settings.py` - Application settings (Dynaconf)
- `src/morpheus/openapi.yml` - API specification

**Infrastructure** (`/infrastructure/local/`):
- `docker-compose.yml` - Local development stack
- `.env` - Environment variables

---

## Common Development Tasks

### Frontend Development

**Setup**:
```bash
cd /Users/ralf/Projects/inowas/morpheus/src/frontend

# Install dependencies (use Node 20.9.0)
nvm use
npm install

# Start development server (with local backend)
npm run start-morpheus-integration-local

# Start with mock server
npm run start-morpheus
```

**Building**:
```bash
# Build all apps
npm run build-morpheus
npm run build-mfviz
npm run build-simpletools

# Build Storybook
npm run build-storybook
```

**Testing**:
```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:ci

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

**Code Quality**:
```bash
# Lint
npm run cs-check

# Fix linting issues
npm run cs-fix

# Dependency cruiser (check architecture)
npm run depcruise:app
```

**Analysis**:
```bash
# Analyze bundle size
npm run analyze-morpheus

# Check outdated packages
npm outdated

# Security audit
npm audit
```

### Backend Development

**Setup**:
```bash
cd /Users/ralf/Projects/inowas/morpheus/src/backend

# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies (creates .venv automatically)
uv sync --extra dev

# Activate virtual environment
source .venv/bin/activate  # or `.venv\Scripts\activate` on Windows

# Run Flask app locally
make run-flask-app
```

**Testing**:
```bash
# Run tests
pytest

# With coverage
pytest --cov=morpheus tests/

# Type checking
pyright
```

### Full Stack Local Development

**Start backend infrastructure**:
```bash
cd /Users/ralf/Projects/inowas/morpheus/src/backend
make install-dev
make start-dev
```

**Start frontend dev server**:
```bash
cd /Users/ralf/Projects/inowas/morpheus/src/frontend
npm run start-morpheus-integration-local
```

**Start Flask app** (in IDE or via make):
```bash
cd /Users/ralf/Projects/inowas/morpheus/src/backend
make run-flask-app
```

### Docker Operations

**Local environment**:
```bash
cd /Users/ralf/Projects/inowas/morpheus

# Install and setup
make install-local

# Start environment
make start-local

# Stop environment
make stop-local

# Reset (delete all containers, volumes, images)
make reset-local
```

**Backend CLI commands in Docker**:
```bash
make run-backend-cli-command-in-local-environment
```

---

## Key Files & Locations

### Configuration
- `/src/frontend/.nvmrc` - Node.js version (20.9.0)
- `/src/frontend/package.json` - Frontend dependencies
- `/src/backend/requirements/prod.txt` - Backend dependencies
- `/infrastructure/local/docker-compose.yml` - Local services
- `/infrastructure/local/.env` - Environment variables

### Application Entry Points
- `/src/frontend/src/morpheus/index.tsx` - Morpheus app entry
- `/src/frontend/src/mfviz/index.tsx` - MfViz app entry
- `/src/frontend/src/simpletools/index.tsx` - SimpleTools app entry
- `/src/backend/src/morpheus/app.py` - Flask app factory

### Build Outputs
- `/src/frontend/dist/morpheus/` - Morpheus production build
- `/src/frontend/dist/mfviz/` - MfViz production build
- `/src/frontend/dist/simpletools/` - SimpleTools production build

### Documentation
- `/README.md` - Main project README
- `/src/frontend/README.md` - Frontend documentation
- `/src/backend/README.md` - Backend documentation
- `/UPGRADE_ANALYSIS.md` - Package upgrade plan (NEW)

---

## Authentication & Local Access

### Keycloak (Identity Server)
- **URL**: http://identity.inowas.localhost
- **Admin Console**: http://identity.inowas.localhost/admin
- **Admin User**: `admin` / `dev`
- **Realm**: `inowas`
- **Client**: `morpheus-frontend`

### Test Users
**Morpheus Admin**:
- Username: `admin@inowas.localhost`
- Password: `dev`

**Normal User**:
- Username: `dev@inowas.localhost`
- Password: `dev`

### Local Services
- **Backend API**: http://localhost:5000
- **Frontend Dev Server**: http://localhost:8080 (webpack dev server)
- **Mailcatcher**: http://mailcatcher.inowas.localhost
- **RabbitMQ**: rabbitmq.inowas.localhost
- **Traefik Dashboard**: http://localhost:8080 (Traefik)

### /etc/hosts Configuration
Required entries:
```
127.0.0.1 identity.inowas.localhost
127.0.0.1 rabbitmq.inowas.localhost
```

---

## Important Notes & Gotchas

### Version Mismatches
- **Node.js**: .nvmrc specifies 20.9.0, but system has 22.19.0 installed
  - Always use `nvm use` before npm commands
  - Upgrade plan will update to Node 22.x LTS

- **Python**: Requirements specify 3.12+, system has 3.14.2
  - Should work, but be aware of potential compatibility issues

### Dependencies Not Installed
- The `node_modules` directory was not found in initial analysis
- Run `npm install` in `/src/frontend` before development

### Build Configuration
- **Three separate Webpack configs** - one for each app
- Each app has its own entry point and output directory
- Shared code is in `/src/frontend/src/common/`

### Authentication Flow
- Uses **OpenID Connect** via Keycloak
- Tokens stored in browser
- Backend validates tokens with Keycloak

### Geospatial Data
- Heavy use of **Leaflet** for 2D maps
- **VTK.js** for 3D visualization (MfViz)
- GeoJSON for data exchange
- CRS transformations handled by backend (GeoPandas)

### Async Processing
- Long-running model calculations use **Celery**
- Results stored in MongoDB
- WebSocket or polling for progress updates (check implementation)

---

## Upgrade Guidelines (When Working on Upgrades)

### Before Starting Any Phase

1. **Create a feature branch**: `upgrade/phase-N-description`
2. **Backup current state**: Commit all changes
3. **Review phase documentation**: See UPGRADE_ANALYSIS.md
4. **Ensure tests pass**: Run full test suite

### During Updates

1. **Update in small batches**: Don't update 50 packages at once
2. **Test after each batch**: Run tests, build apps
3. **Document issues**: Keep notes on problems and solutions
4. **Check for breaking changes**: Review package changelogs

### After Each Phase

1. **Full test suite**: Automated and manual tests
2. **Build all three apps**: Ensure no build failures
3. **Test in Docker**: Run in local Docker environment
4. **Update documentation**: Note any changes
5. **Commit with clear message**: Describe what was updated

### Critical Testing Points

**After React 19 Update**:
- Authentication flow (OIDC)
- Map interactions (Leaflet + React-Leaflet)
- 3D visualization (VTK.js + React)
- State management (Redux)
- Routing (React Router)
- Form handling
- Date pickers
- Charts and graphs

**After GeoPandas Update**:
- GeoJSON import/export
- Coordinate transformations
- Spatial operations (buffer, intersection, etc.)
- Boundary calculations

---

## Troubleshooting

### Frontend Build Issues

**"Module not found" errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors after update**:
```bash
# Restart TypeScript server (VS Code)
Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or regenerate tsconfig
npx tsc --init
```

**Webpack dev server issues**:
```bash
# Check Node version
node --version  # Should match .nvmrc

# Use correct version
nvm use

# Clear webpack cache
rm -rf node_modules/.cache
```

### Backend Issues

**Import errors**:
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Or in Docker
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Database connection issues**:
```bash
# Check services are running
docker ps

# Restart services
cd infrastructure/local
docker-compose restart mongodb_backend rabbitmq
```

### Docker Issues

**Containers won't start**:
```bash
# Check logs
docker-compose logs <service-name>

# Full restart
make stop-local
make start-local
```

**Port conflicts**:
```bash
# Check what's using ports
lsof -i :5000  # Backend
lsof -i :8080  # Frontend/Traefik
lsof -i :27017 # MongoDB
```

---

## Code Style & Best Practices

### TypeScript

**Use strict typing**:
```typescript
// Good
interface Props {
  name: string;
  age: number;
}

const Component = ({ name, age }: Props) => { ... }

// Avoid
const Component = (props: any) => { ... }
```

**Prefer functional components**:
```typescript
// Good (modern)
const Component = ({ title }: Props) => {
  const [state, setState] = useState<StateType>(initialState);
  return <div>{title}</div>;
}

// Avoid (class components unless necessary)
class Component extends React.Component { ... }
```

### React Patterns

**Use hooks**:
- `useState` for local state
- `useEffect` for side effects
- `useContext` for context
- `useSelector` / `useDispatch` for Redux

**Component structure**:
```typescript
// 1. Imports
import { useState } from 'react';

// 2. Types
interface Props { ... }

// 3. Component
const Component = ({ prop }: Props) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => { ... }

  // 6. Render
  return <div>...</div>;
}

// 7. Export
export default Component;
```

### Backend (Python)

**Follow domain-driven design**:
- Application layer: Use cases, command handlers
- Domain layer: Business logic, entities
- Infrastructure layer: Database, external services
- Presentation layer: API endpoints, serialization

**Type hints**:
```python
def calculate_flow(
    head: float,
    conductivity: float
) -> FlowResult:
    ...
```

---

## Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [FloPy Documentation](https://flopy.readthedocs.io/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### Project-Specific
- **OpenAPI Spec**: `/src/backend/src/morpheus/openapi.yml`
- **Architecture Docs**: `/concepts/` (if exists)
- **Storybook**: Build and view component library

### Upgrade Resources
- See **Appendix C** in UPGRADE_ANALYSIS.md for migration guides

---

## When to Ask for Help

### Always Ask If:
1. **Breaking production**: Any change that could affect deployed systems
2. **Uncertain about approach**: Multiple valid solutions, need guidance
3. **Security concerns**: Authentication, authorization, data handling
4. **Major architectural changes**: Affects multiple domains
5. **Data migrations**: MongoDB, PostgreSQL schema changes

### Safe to Proceed:
1. **Minor version updates**: Patch/minor with good test coverage
2. **UI improvements**: Component changes with visual testing
3. **Test additions**: Adding tests is always good
4. **Documentation**: Improving docs
5. **Refactoring**: With good test coverage and no behavior changes

---

## Git Workflow

### Branches
- `main` - Production-ready code
- `feature/*` - New features
- `upgrade/*` - Package upgrades
- `fix/*` - Bug fixes

### Commit Messages
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore, upgrade

**Example**:
```
upgrade(frontend): Update React to 19.2.4

- Update React and React DOM to 19.2.4
- Update all React ecosystem packages
- Fix breaking changes in component types
- Update tests for new React behavior

BREAKING CHANGE: React.FC no longer includes children by default
```

---

## Quick Reference

### Frontend Commands
```bash
npm install              # Install dependencies
npm run start-morpheus-integration-local  # Dev server
npm run build-morpheus   # Production build
npm run test:ci          # Run tests
npm run cs-fix          # Fix linting
npm outdated            # Check for updates
```

### Backend Commands
```bash
uv sync --extra dev             # Install deps with uv
make run-flask-app              # Run Flask
pytest                          # Run tests
pyright                         # Type check

# Alternative: manage dependencies
uv add <package-name>           # Add new dependency
uv add --dev <package-name>     # Add dev dependency
uv lock                         # Update lock file
```

### Docker Commands
```bash
make install-local   # Setup local environment
make start-local     # Start services
make stop-local      # Stop services
make reset-local     # Full reset
```

---

## Contact & Escalation

### Technical Decisions
- **Architecture changes**: Consult tech lead
- **Breaking changes**: Review with team
- **Security**: Security team review required

### External Support
- **Keycloak**: Check Keycloak documentation
- **MODFLOW/FloPy**: FloPy GitHub issues
- **React/Webpack**: Official documentation

---

**This file should be kept up to date as the project evolves. Update it when:**
- Major architectural changes occur
- New patterns are established
- Package upgrades complete
- New developers join the project
- Common issues are discovered

**Last Review**: 2026-02-02
**Next Review**: After Phase 1 of upgrade completes