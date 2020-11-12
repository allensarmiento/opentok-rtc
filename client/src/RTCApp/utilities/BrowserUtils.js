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
