/**
 * pathName should be /room/<roomURI>[?username=<username>]
 * pathNames should at least by /room/roomURI
 */
const MINIMUM_PATHNAME_LENGTH = 2;

/**
 * @param {string} pathname Document pathname
 * @return {Array<string>} Pathname array of url
 */
export function splitPathName(pathname) {
  if (!pathname) throw new Error('No pathname specified');

  // pathName should be /room/<roomURI>[?username=<username>]
  const pathName = pathname.split('/');

  // pathNames should at least be: https://domain/room/roomURI
  if (pathName.length < MINIMUM_PATHNAME_LENGTH) {
    throw new Error('Invalid path');
  }

  return pathName;
}

/**
 * @param {Array<string>} pathName
 * @return {string} Last element of pathNameArr
 */
export function getRoomURI(pathNameArr) {
  if (!Array.isArray(pathNameArr)) throw new Error('Invalid pathNameArr');

  let roomURI = '';

  const { length } = pathNameArr;
  if (length > 0) {
    roomURI = pathNameArr[length - 1];
  }

  return roomURI;
}

/**
 * @param {string} str
 * @return {string} decoded URI
 */
export function decodeStr(str) {
  return str ? window.decodeURIComponent(str) : str;
}

/**
 * @param {undefined | Array} curValue
 * @param {string} newValue
 */
const addValue = (curValue, newValue) => {
  let valueToAdd = [];

  if (curValue === undefined) return newValue;
  if (!Array.isArray(curValue)) valueToAdd = [curValue];

  valueToAdd.push(newValue);
  return valueToAdd;
};

/**
 * @param {string} searchStr
 * @return {object} Decoded string parameters
 */
export function parseSearch(searchStr) {
  const decodedStr = decodeStr(searchStr);
  const initialParams = { params: {} };

  if (typeof searchStr !== 'string') return initialParams;

  return decodedStr
    .slice(1)
    .split('&')
    .map((param) => param.split(/=(.+)?/))
    .reduce((object, currentValue) => {
      const newObject = { ...object };
      const parName = currentValue[0];

      newObject.params[parName] = addValue(
        newObject.params[parName],
        currentValue[1] || null,
      );
      return newObject;
    }, initialParams);
}

/**
 * Retrieves the array item from object or value.
 * @param {object} object Object to search.
 * @param {string} key Key to obtain the value from object.
 * @return {string | number | object}
 */
export function getFirstValFromObjKey(object, key) {
  if (!(key in object)) return '';

  return Array.isArray(object[key])
    ? object[key][0]
    : object[key];
}
