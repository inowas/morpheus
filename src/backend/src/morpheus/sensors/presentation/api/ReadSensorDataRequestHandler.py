from flask import Request, abort

from ...application.read import ReadSensorDataQuery, QueryBus


class ReadSensorDataRequestHandler:
    @staticmethod
    def handle(request: Request, project: str, sensor: str, parameter: str):
        result = QueryBus().execute(ReadSensorDataQuery(project=project, sensor=sensor, parameter=parameter))
        if not result.is_success:
            return abort(400, result.data)

        return result.data.to_dict(), 200

    # valid_time_resolution_list = ['RAW', '6H', '12H', '1D', '2D', '1W']
    # time_resolution = request.args.get('timeResolution', '1D').upper()
    #
    # if time_resolution not in valid_time_resolution_list:
    #     abort(400, 'Invalid timeResolution {0} provided. Valid values are: {1}'.format(
    #         time_resolution,
    #         ', '.join(valid_time_resolution_list)
    #     ))
    #
    # valid_date_formats = ['iso', 'epoch']
    # date_format = request.args.get('dateFormat', 'iso').lower()
    #
    # if date_format not in valid_date_formats:
    #     abort(400, 'Invalid dateFormat {0} provided. Valid values are: {1}'.format(
    #         date_format,
    #         ', '.join(valid_date_formats)
    #     ))
    #
    # query = "select date_time, value from view_data_raw " \
    #         "where sensor_name='{0}' " \
    #         "and project_name = '{1}' " \
    #         "and parameter_name = '{2}' " \
    #     .format(sensor, project, parameter)
    #
    # start = request.args.get('start', None) or request.args.get('begin', None)
    # if start is not None:
    #     query += "and date_time >= to_timestamp({0}) ".format(int(start))
    #
    # end = request.args.get('end', None)
    # if end is not None:
    #     query += "and date_time <= to_timestamp({0}) ".format(int(end))
    #
    # gte = request.args.get('gte', None) or request.args.get('min', None)
    # if gte is not None:
    #     query += "and value >= {0} ".format(float(gte))
    #
    # gt = request.args.get('gte', None)
    # if gt is not None:
    #     query += "and value > {0} ".format(float(gt))
    #
    # lte = request.args.get('lte', None) or request.args.get('max', None)
    # if lte is not None:
    #     query += "and value <= {0} ".format(float(lte))
    #
    # lt = request.args.get('lt', None)
    # if lt is not None:
    #     query += "and value < {0} ".format(float(lt))
    #
    # excl = request.args.get('excl', None)
    # if excl is not None:
    #     query += "and value <> {0} ".format(float(excl))
    #
    # query += "order by date_time"
    # df = pd.read_sql_query(query, db.engine)
    #
    # if (df.empty):
    #     return jsonify([])
    #
    # df = df.set_index('date_time')
    #
    # if time_resolution != 'RAW':
    #     df = df.resample(time_resolution).mean().interpolate(method='time')
    #     df = df.round(4)
    #
    # df = df.reset_index(level=0)
    # return df.to_json(date_unit='s', date_format=date_format, orient='records')
