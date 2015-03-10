from app import db

class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    accel_x = db.Column(db.Float, index=True, unique=False)
    accel_y = db.Column(db.Float, index=True, unique=False)
    accel_z = db.Column(db.Float, index=True, unique=False)
    gyro_x = db.Column(db.Float, index=True, unique=False)
    gyro_y = db.Column(db.Float, index=True, unique=False)
    gyro_z = db.Column(db.Float, index=True, unique=False)
    mag_x = db.Column(db.Float, index=True, unique=False)
    mag_y = db.Column(db.Float, index=True, unique=False)
    mag_z = db.Column(db.Float, index=True, unique=False)

    def __repr__(self):
        representation = '<Accel_x %f>' % (self.accel_x)
        ('<Accel_y %f>' % (self.accel_y))
        ('<Accel_z %f>' % (self.accel_z))
        ('<Gyro_x %f>' % (self.gyro_x))
        ('<Gyro_y %f>' % (self.gyro_y))
        ('<Gyro_z %f>' % (self.gyro_z))
        ('<Mag_x %f>' % (self.mag_x))
        ('<Mag_y %f>' % (self.mag_y))
        ('<Mag_z %f>' % (self.mag_z))

       	return representation