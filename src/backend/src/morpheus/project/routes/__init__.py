"""
Routes package for the project domain.

This package organizes routes by domain for better maintainability:
- projects: Project metadata, list, privileges, event log, messagebox
- models: Model data, spatial/time discretization, grid, affected cells
- layers: Layer properties and images
- boundaries: Boundaries and affected cells
- observations: Head observations
- calculations: Calculations and all result types (budget, layer, observation, time series, files)
- calculation_profiles: Calculation profiles (selected and list)
- assets: Assets upload/download, data, preview images
"""

from flask import Blueprint
from flask_cors import CORS

from . import (
    assets,
    boundaries,
    calculation_profiles,
    calculations,
    layers,
    models,
    observations,
    projects,
)


def register_routes(blueprint: Blueprint):
    """Register all project-related routes organized by domain."""
    CORS(blueprint, supports_credentials=True)

    # Project routes: list, metadata, privileges, event log, messagebox
    projects.register_routes(blueprint)

    # Model routes: model, spatial/time discretization, grid, affected cells
    models.register_routes(blueprint)

    # Layer routes: layers list, layer properties (data and images)
    layers.register_routes(blueprint)

    # Boundary routes: boundaries list/single, affected cells
    boundaries.register_routes(blueprint)

    # Observation routes: head observations
    observations.register_routes(blueprint)

    # Calculation routes: calculations list/details, all result types
    calculations.register_routes(blueprint)

    # Calculation profile routes: selected profile, profiles list
    calculation_profiles.register_routes(blueprint)

    # Asset routes: upload/download, list, asset data, preview images
    assets.register_routes(blueprint)
