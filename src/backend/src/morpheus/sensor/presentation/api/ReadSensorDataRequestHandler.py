from flask import Request, abort

from ...application.read.ReadSensorData import InvalidDateFormatException, InvalidTimeResolutionException, ReadSensorDataQuery, ReadSensorDataQueryHandler, SensorNotFoundException


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

        start_timestamp = request.args.get('start', None) or request.args.get('begin', None)
        if start_timestamp is not None:
            start_timestamp = int(start_timestamp)

        end_timestamp = request.args.get('end', None)
        if end_timestamp is not None:
            end_timestamp = int(end_timestamp)

        try:
            result = ReadSensorDataQueryHandler.handle(
                ReadSensorDataQuery(
                    project=project,
                    sensor=sensor,
                    parameter=parameter,
                    start_timestamp=start_timestamp,
                    end_timestamp=end_timestamp,
                    gte=gte,
                    gt=gt,
                    lte=lte,
                    lt=lt,
                    excl=excl,
                    time_resolution=request.args.get('timeResolution', '1D'),
                    date_format=request.args.get('dateFormat', 'iso'),
                )
            )
            return result.to_dict(), 200

        except InvalidTimeResolutionException as e:
            abort(400, str(e))
        except InvalidDateFormatException as e:
            abort(400, str(e))
        except SensorNotFoundException as e:
            abort(404, str(e))
