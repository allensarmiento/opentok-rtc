export function decodeStr(str) {
  return str 
    ? window.decodeURIComponent(str) 
    : str;
}

export function parseSearch(searchStr) {
  searchStr = decodeStr(searchStr);
  
  return searchStr
    .slice(1)
    .split('&')
    .map(param => param.split(/=(.+)?/))
    .reduce((object, currentValue) => {
      const parName = currentValue[0];
      object.params[parName] = addValue(
        object.params[parName], 
        currentValue[1] || null
      );
      return object;
    }, {
      params: {},
      getFirstValue: function(param) {
        return Array.isArray(this.params[param])
          ? this.params[param][0]
          : this.params[param];
      }
    });
}

function addValue(curValue, newValue) {
  if (curValue === undefined) {
    return newValue;
  }

  if (!Array.isArray(curValue)) {
    curValue = [curValue];
  }

  curValue.push(newValue);

  return curValue;
}

