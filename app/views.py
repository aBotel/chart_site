from flask import render_template, jsonify, make_response, request, abort
from app import app

data = {
    'accel':{'data':[], 'description':"Accelerometer"},
    'gyro':{'data':[], 'description':"Gyro"},
    'magnet':{'data':[], 'description':"Magnetometer"}
}

posts = [
    { 
    'author': {'nickname': 'John'}, 
    'body': 'Beautiful day in Portland!' 
    },
    { 
    'author': {'nickname': 'Susan'}, 
    'body': 'The Avengers movie was so cool!' 
    }
]


@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Miguel'}
    return render_template('index.html',
                           title='Home',
                           user=user,
                           posts=posts)


@app.route('/motion/api/v1/list_accel',methods=['GET'])
def get_accel_list():
    #Return all the stored accelerometer JSON objects
    return jsonify(data.get('accel'))

@app.route('/motion/api/v1/list_gyro',methods=['GET'])
def get_gyro_magnet_list():
    #Return all the stored gyro JSON objects
    return jsonify(data.get('gyro'))

@app.route('/motion/api/v1/list_magnet',methods=['GET'])
def get_magnet_list():
    #Return all the stored magnetometer JSON objects
    return jsonify(data.get('magnet'))


@app.route('/motion/api/v1/accel', methods=['POST'])
def receive_accel():
    # Check to make sure the incoming data is in JSON Format
    if not request.json:
        abort(400)
    accel_point = {
        'x':request.json['x'],
        'y':request.json['y'],
        'z':request.json['z'],
        't':request.json['t']
    }
    print("Got an accelerometer post message ->" + str(accel_point))
    data['accel']['data'].append(accel_point)
    return jsonify(accel_point), 201

@app.route('/motion/api/v1/gyro', methods=['POST'])
def receive_gyro():
    # Check to make sure the incoming data is in JSON Format
    if not request.json:
        abort(400)
    gyro_point = {
        'x': request.json['x'],
        'y': request.json['y'],
        'z': request.json['z'],
        't': request.json['t']
    }
    print("Got an gyroscope post message ->" + str(gyro_point))
    data['gyro']['data'].append(gyro_point)
    return jsonify(gyro_point), 201

@app.route('/motion/api/v1/magnet', methods=['POST'])
def receive_magnet():
    # Check to make sure the incoming data is in JSON Format
    if not request.json:
        abort(400)
    magnet_point = {
        'x': request.json['x'],
        'y': request.json['y'],
        'z': request.json['z'],
        't': request.json['t']
    }
    print("Got an magnetometer post message ->" + str(magnet_point))
    data['magnet']['data'].append(magnet_point)
    return jsonify(magnet_point), 201

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

