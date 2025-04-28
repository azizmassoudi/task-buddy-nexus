"""add image url to services

Revision ID: add_image_url_to_services
Revises: f9334969cfe7
Create Date: 2024-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_image_url_to_services'
down_revision = 'f9334969cfe7'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('services', sa.Column('imageUrl', sa.String(), nullable=True))


def downgrade():
    op.drop_column('services', 'imageUrl') 