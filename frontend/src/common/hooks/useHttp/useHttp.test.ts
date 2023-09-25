import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {renderHook} from '@testing-library/react-hooks';
import useHttp, {IHttpError, IOAuthToken} from './useHttp';

describe('Test the useHttp-Hook', () => {
  const mockAxios = new MockAdapter(axios);
  const apiBaseUrl = '/ultron/api/v1';
  const token: IOAuthToken = {
    access_token: 'token-123',
    expires_in: 123,
    token_type: 'Bearer',
    scope: null,
    refresh_token: 'refresh-123',
    user_id: 1,
  };

  const mockAuth = {
    token,
    onRefreshToken: jest.fn(),
    onUnauthorized: jest.fn(),
  };

  beforeEach(() => {
    mockAxios.reset();
  });

  test('Test httpGet success', async () => {
    mockAxios.onGet(`${apiBaseUrl}/test-123`).replyOnce(200, {test: '123'});
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpGet('/test-123');
    expect(response.ok).toEqual(true);
    expect(response.val).toEqual({test: '123'});
  });

  test('Test httpGet error', async () => {
    mockAxios.onGet(`${apiBaseUrl}/test-123`).replyOnce(400, {test: '123'});
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpGet('/test-123');
    expect(response.err).toEqual(true);
    const error = response.val as IHttpError;
    expect(error.code).toEqual(400);
  });

  test('Test httpPut success', async () => {
    mockAxios.onPut(`${apiBaseUrl}/test-123`, {}).replyOnce(204);
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpPut('/test-123', {});
    expect(response.ok).toEqual(true);
    expect(response.val).toEqual(undefined);
  });

  test('Test httpPut error', async () => {
    mockAxios.onPut(`${apiBaseUrl}/test-123`).replyOnce(400, {test: '123'});
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpPut('/test-123', {});
    expect(response.err).toEqual(true);
    const error = response.val as IHttpError;
    expect(error.code).toEqual(400);
  });

  test('Test httpPost success', async () => {
    mockAxios.onPost(`${apiBaseUrl}/test-123`, {}).replyOnce(201, {test: '123'}, {location: '/test-123/new'});
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpPost('/test-123', {});
    expect(response.ok).toEqual(true);
    expect(response.val).toEqual({location: '/test-123/new'});
  });

  test('Test httpPost error', async () => {
    mockAxios.onPost(`${apiBaseUrl}/test-123`).replyOnce(400, {test: '123'});
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpPost('/test-123', {});
    expect(response.err).toEqual(true);
    const error = response.val as IHttpError;
    expect(error.code).toEqual(400);
  });

  test('Test httpDelete success', async () => {
    mockAxios.onDelete(`${apiBaseUrl}/test-123`, {}).replyOnce(204);
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpDelete('/test-123');
    expect(response.ok).toEqual(true);
    expect(response.val).toEqual(undefined);
  });

  test('Test httpDelete error', async () => {
    mockAxios.onDelete(`${apiBaseUrl}/test-123`).replyOnce(400, {test: '123'});
    const {result} = renderHook(() => useHttp(apiBaseUrl, mockAuth));
    const response = await result.current.httpDelete('/test-123');
    expect(response.err).toEqual(true);
    const error = response.val as IHttpError;
    expect(error.code).toEqual(400);
  });
});
