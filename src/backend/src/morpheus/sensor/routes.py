from flask import Blueprint, request
from flask_cors import CORS, cross_origin

from ..common.presentation.api.middleware.schema_validation import validate_request
from .application.read.ReadSensorData import InvalidDateFormatException, InvalidTimeResolutionException, SensorNotFoundException
from .presentation.api import ReadSensorListRequestHandler, ReadSensorsLatestValuesRequestHandler
from .presentation.api.ReadSensorDataRequestHandler import ReadSensorDataRequest, ReadSensorDataRequestHandler


def register_routes(blueprint: Blueprint):
    CORS(blueprint, supports_credentials=True)

    @blueprint.route('', methods=['GET'])
    @blueprint.route('/', methods=['GET'])
    @cross_origin()
    @validate_request
    def read_sensors():
        return ReadSensorListRequestHandler.handle()

    @blueprint.route('/latest', methods=['GET'])
    @cross_origin()
    @validate_request
    def read_sensors_latest_values():
        return ReadSensorsLatestValuesRequestHandler.handle()

    @blueprint.route('/project/<project>/sensor/<sensor>/parameter/<parameter>', methods=['GET'])
    @cross_origin()
    def read_sensor_data(project, sensor, parameter):
        req = ReadSensorDataRequest(
            gte=request.args.get('gte', type=float),
            gt=request.args.get('gt', type=float),
            lte=request.args.get('lte', type=float),
            lt=request.args.get('lt', type=float),
            excl=request.args.get('excl', type=float),
            start_timestamp=request.args.get('start_timestamp', type=int),
            end_timestamp=request.args.get('end_timestamp', type=int),
            time_resolution=request.args.get('time_resolution', default='1D'),
            date_format=request.args.get('date_format', default='iso'),
        )
        try:
            return ReadSensorDataRequestHandler.handle(
                request=req,
                project=project,
                sensor=sensor,
                parameter=parameter,
            )
        except (InvalidDateFormatException, InvalidTimeResolutionException, SensorNotFoundException) as e:
            return {'error': str(e)}, 400
