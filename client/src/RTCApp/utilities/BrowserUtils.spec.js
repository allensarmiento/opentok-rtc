import * as BrowserUtils from './BrowserUtils';

describe('getPathName', () => {
  test('throws an error on empty pathname', () => {
    function splitEmpty() {
      BrowserUtils.splitPathName();
    }

    expect(splitEmpty).toThrow();
    expect(splitEmpty).toThrowError(new Error('No pathname specified'));    
  });

  test('throws an error on pathname under minimum length', () => {
    function splitLessThanMinimum() {
      BrowserUtils.splitPathName('test')
    }

    expect(splitLessThanMinimum).toThrow();
    expect(splitLessThanMinimum).toThrowError(new Error('Invalid path'));
  });

  it('returns the pathname as an array', () => {
    expect(BrowserUtils.splitPathName('/test')).toEqual(['', 'test']);
    expect(BrowserUtils
      .splitPathName('/room/test'))
      .toEqual(['', 'room', 'test']);
  });
});

describe('getRoomURI', () => {
  test('throws an error if pathname is invalid', () => {
    expect(() => BrowserUtils.getRoomURI()).toThrow();
    expect(() => BrowserUtils.getRoomURI())
      .toThrowError(new Error('Invalid pathNameArr'));
    expect(() => BrowserUtils.getRoomURI('')).toThrow();
    expect(() => BrowserUtils.getRoomURI(''))
      .toThrowError(new Error('Invalid pathNameArr'));
    expect(() => BrowserUtils.getRoomURI(1)).toThrow();
    expect(() => BrowserUtils.getRoomURI(1))
      .toThrowError(new Error('Invalid pathNameArr'));
    expect(() => BrowserUtils.getRoomURI({})).toThrow();
    expect(() => BrowserUtils.getRoomURI({}))
      .toThrowError(new Error('Invalid pathNameArr'));
  });

  it('returns empty if pathNameArr is empty', () => {
    expect(BrowserUtils.getRoomURI([])).toEqual('');
  });

  it('returns the last element in array', () => {
    expect(BrowserUtils.getRoomURI(['', 'room', 'test'])).toEqual('test');
  });
});

describe('decodeStr', () => {
  it('returns nothing on empty', () => {
    expect(BrowserUtils.decodeStr()).toBeUndefined();
  });

  it('returns decoded string if exists', () => {
    expect(BrowserUtils.decodeStr('test')).toEqual('test');
    expect(BrowserUtils.decodeStr('%3Fx%3Dtest')).toEqual('?x=test');
  });
});

describe('parseSearch', () => {
  it('returns empty object on empty', () => {
    expect(BrowserUtils.parseSearch()).toMatchObject({ params: {} });
    expect(BrowserUtils.parseSearch('')).toMatchObject({ params: {} });
  });

  it('returns object parameters', () => {
    expect(BrowserUtils.parseSearch('?test1=1&test2=2'))
      .toMatchObject({ params: { test1: '1', test2: '2' }});
  });
});

describe('getFirstValueFromObjectKey', () => {
  it('returns empty string on empty object', () => {
    expect(BrowserUtils.getFirstValFromObjKey({}, 'test')).toEqual('');
  });

  it('returns first element of array if key exists', () => {
    expect(BrowserUtils.getFirstValFromObjKey({
      test: [0, 1, 2, 3, 4, 5]
    }, 'test')).toEqual(0);
  });

  it('returns value if key exists', () => {
    expect(BrowserUtils.getFirstValFromObjKey({ 
      test: 'testing'
    }, 'test')).toEqual('testing');
  });
});
