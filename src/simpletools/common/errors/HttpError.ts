import HttpStatusCode from './HttpStatusCode.enum';

class HttpError {
  constructor(private code: number, private message: string) {
  }

  public static unauthorized(message: string) {
    return new HttpError(HttpStatusCode.UNAUTHORIZED, message);
  }

  public static forbidden(message: string) {
    return new HttpError(HttpStatusCode.FORBIDDEN, message);
  }

  public static notFound(message: string) {
    return new HttpError(HttpStatusCode.NOT_FOUND, message);
  }

  public static tooManyRequests(message: string) {
    return new HttpError(HttpStatusCode.TOO_MANY_REQUESTS, message);
  }

  public static internalServerError(message: string) {
    return new HttpError(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
  }

  public static unprocessableEntity(message: string) {
    return new HttpError(HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }

  public getCode() {
    return this.code;
  }

  public getMessage() {
    return this.message;
  }
}

export default HttpError;
