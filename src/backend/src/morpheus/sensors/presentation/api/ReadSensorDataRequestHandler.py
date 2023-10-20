from flask import Request, abort
from pandas import DataFrame

from ...application.read import ReadSensorDataQuery, QueryBus


class ReadSensorDataRequestHandler:
    @staticmethod
    def handle(request: Request, project: str, sensor: str, parameter: str):

        gte = request.args.get('gte', None) or request.args.get('min', None)
        if gte is not None:
            gte = float(gte)

        gt = request.args.get('gte', None)
        if gt is not None:
            gt = float(gt)

        lte = request.args.get('lte', None) or request.args.get('max', None)
        if lte is not None:
            lte = float(lte)

        lt = request.args.get('lt', None) or request.args.get('max', None)
        if lt is not None:
            lt = float(lt)

        excl = request.args.get('excl', None)
        if excl is not None:
            excl = float(excl)

        result = QueryBus().execute(ReadSensorDataQuery(
            project=project,
            sensor=sensor,
            parameter=parameter,
            start_timestamp=request.args.get('start', None) or request.args.get('begin', None),
            end_timestamp=request.args.get('end', None),
            gte=gte,
            gt=gt,
            lte=lte,
            lt=lt,
            excl=excl,
            time_resolution=request.args.get('timeResolution', '1D'),
            date_format=request.args.get('dateFormat', 'iso')
        ))
        if not result.is_success:
            abort(result.status_code, result.message)

        return result.data.to_dict(), result.status_code

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
