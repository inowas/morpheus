"""create oauth2 tables

Revision ID: 3469c565e427
Revises: 64d5b09dfa44
Create Date: 2023-08-21 15:43:52.572542

"""
from typing import Sequence, Union
from morpheus.authentication.infrastructure.oauth2.models import OAuth2User, OAuth2Client, OAuth2Token
from morpheus.common.infrastructure.persistence.database import db
from wsgi import app

# revision identifiers, used by Alembic.
revision: str = '3469c565e427'
down_revision: Union[str, None] = '64d5b09dfa44'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with app.app_context():
        db.metadata.create_all(
            db.engine,
            tables=[
                OAuth2User.__table__,
                OAuth2Client.__table__,
                OAuth2Token.__table__,
            ]
        )


def downgrade() -> None:
    with app.app_context():
        db.metadata.drop_all(
            db.engine,
            tables=[
                OAuth2User.__table__,
                OAuth2Client.__table__,
                OAuth2Token.__table__,
            ]
        )
