import {HttpError} from '../index';
import HttpStatusCode from '../HttpStatusCode.enum';

describe('Test HttpError Class', () => {
  test('Test instantiate', () => {
    expect(HttpError.unauthorized('login_failed')).toBeInstanceOf(HttpError);
    expect(HttpError.unauthorized('login_failed').getMessage()).toEqual('login_failed');
    expect(HttpError.unauthorized('login_failed').getCode()).toEqual(HttpStatusCode.UNAUTHORIZED);
    expect(HttpError.internalServerError('test_string').getCode()).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(HttpError.internalServerError('test_string').getMessage()).toEqual('test_string');
  });
});
