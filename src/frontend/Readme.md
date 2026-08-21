# Morpheus Frontend

The Morpheus frontend consists of three React applications:

1. **Morpheus**: The main modeling and DSS dashboard.
2. **MfViz**: A specialized MODFLOW visualization tool.
3. **SimpleTools**: A collection of utility tools.

## Technology Stack

- **Core**: React 18, TypeScript
- **State**: Redux Toolkit
- **Mapping**: Leaflet, React-Leaflet, Geoman
- **Visualization**: VTK.js, Recharts, D3
- **Build Tool**: Webpack

## Quick Start

1. **Install dependencies**:
   ```bash
   cd src/frontend
   npm install
   ```
2. **Run Development Server**:
   ```bash
   make start-morpheus-integration-local
   ```

## Architecture

The frontend is modular, with shared components and business logic distributed across the `src/morpheus/`, `src/mfviz/`, and `src/simpletools/` directories. It communicates with the backend via a RESTful API.
