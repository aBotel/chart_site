from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
user = Table('user', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('accel_x', FLOAT),
    Column('accel_y', FLOAT),
    Column('accel_z', FLOAT),
    Column('gyro_x', FLOAT),
    Column('gyro_y', FLOAT),
    Column('gyro_z', FLOAT),
    Column('mag_x', FLOAT),
    Column('mag_y', FLOAT),
    Column('mag_z', FLOAT),
)

data = Table('data', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('accel_x', Float),
    Column('accel_y', Float),
    Column('accel_z', Float),
    Column('gyro_x', Float),
    Column('gyro_y', Float),
    Column('gyro_z', Float),
    Column('mag_x', Float),
    Column('mag_y', Float),
    Column('mag_z', Float),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['user'].drop()
    post_meta.tables['data'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['user'].create()
    post_meta.tables['data'].drop()
