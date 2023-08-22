"""create oauth2 tables

Revision ID: 3469c565e427
Revises: 64d5b09dfa44
Create Date: 2023-08-21 15:43:52.572542

"""
from typing import Sequence, Union
from morpheus.authentication.infrastructure.oauth2.models import create_tables, drop_tables
from wsgi import app

# revision identifiers, used by Alembic.
revision: str = '3469c565e427'
down_revision: Union[str, None] = '64d5b09dfa44'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    create_tables(app)


def downgrade() -> None:
    drop_tables(app)
