"""
Project routes module.

This module registers all project routes organized by domain.
Routes are organized in the routes/ folder for better maintainability.
"""

from flask import Blueprint
from flask_cors import CORS

from .routes import (
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
    CORS(blueprint, supports_credentials=True)

    # Register routes from each domain module
    projects.register_routes(blueprint)
    models.register_routes(blueprint)
    layers.register_routes(blueprint)
    boundaries.register_routes(blueprint)
    observations.register_routes(blueprint)
    calculations.register_routes(blueprint)
    calculation_profiles.register_routes(blueprint)
    assets.register_routes(blueprint)
