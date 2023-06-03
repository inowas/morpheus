import {getQueryStringParams} from '../index';

describe('Test getQueryStringParams', () => {

  test('getQueryStringParams', () => {
    expect(getQueryStringParams('?id=2')).toEqual({id:'2'});
  });

  test('getQueryStringParams without params', () => {
    expect(getQueryStringParams('')).toEqual({});
  });

});