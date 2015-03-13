from flask import render_template, jsonify, make_response, request, abort
from app import app
from app import helperFunctions

data = {
    'accel':{'data':[], 'description':"Accel"},
    'gyro':{'data':[], 'description':"Gyro"},
    'magnet':{'data':[], 'description':"Magnet"}
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


@app.route('/motion/api/v1/accel',methods=['GET'])
def get_accel_list():
    #Return all the stored accelerometer JSON objects
    print(data.get('accel'))
    return jsonify(data.get('accel'))

@app.route('/motion/api/v1/gyro',methods=['GET'])
def get_gyro_magnet_list():
    #Return all the stored gyro JSON objects
    print(data.get('gyro'))
    return jsonify(data.get('gyro'))

@app.route('/motion/api/v1/magnet',methods=['GET'])
def get_magnet_list():
    #Return all the stored magnetometer JSON objects
    print(data.get('magnet'))
    return jsonify(data.get('magnet'))

@app.route('/motion/api/v1/all',methods=['GET'])
def get_all_data_list():
    #Return all the stored magnetometer JSON objects
    return jsonify(data)


@app.route('/motion/api/v1/accel', methods=['PUT'])
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

@app.route('/motion/api/v1/gyro', methods=['PUT'])
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

@app.route('/motion/api/v1/magnet', methods=['PUT'])
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

@app.route('/motion/api/v1/all', methods=['PUT'])
def receive_all():
    # Check to make sure the incoming data is in JSON Format
    if not request.json:
        abort(400)
    accel_data = request.json['accel']['data']
    gyro_data = request.json['gyro']['data'] 
    magnet_data = request.json['magnet']['data']

    print("Got an all_data post message ->")
    data['accel']['data'].append(accel_data)
    data['gyro']['data'].append(gyro_data)
    data['magnet']['data'].append(magnet_data)
    print("Completed update after receiving all_data post message!")
    return jsonify([accel_data,gyro_data,magnet_data]), 201

@app.route('/motion/api/v1/debug_print', methods=['GET'])
def debug_print():
    print("In debug print")
    print("All data: "+data)

@app.route('/motion/api/v1/start/', methods=['POST'])
def start_service():
    print("Starting JSON Restful Service")
    enable_motion_api()

@app.route('/motion/api/v1/stop', methods=['POST'])
def stop_service():
    print("Stopping JSON Restful Service")
    disable_motion_api()

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

