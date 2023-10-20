from flask import Request, abort
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

        result = QueryBus().execute(
            ReadSensorDataQuery(
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
