const redis = require('ioredis');

class ServerPersistence {
  constructor(cachedEntries, connectParams, logLevel, modules={}, prefix) {
    this.PREFIX = prefix || '';
    this.LOCK_SUFFIX = '__lock__';
    this.CONNECT_TIMEOUT = 5000;
    this.TIMEOUT_ERROR = 'Timeout while connecting to the PersistenceProvider. Is it running?';

    this.cachedEntries = cachedEntries;
    this.connectParams = connectParams;
    this.logLevel = logLevel;
    this.modules = modules;

    this.provider = this._connectToPersistenceProvider();

    this.cached = null;
  }

  /**
   * Returns a promise: Tries to retrieve the key from redis.
   * @param {*} keyName 
   * @param {*} asObject 
   */
  getKey(keyName, asObject) {
    if (!keyName) { 
      return Promise.resolve(null); 
    }

    keyName = this._getKey(keyName);

    if (this.cached && this.cached[keyName]) {
      return Promise.resolve(this.cached[keyName]);
    }

    return this.provider.get(keyName).then(value => {
      try {
        return asObject && value && JSON.parse(value) || value;
      } catch (err) {
        return value;
      }
    });
  }

  delKey(keyName) {
    return this.provider.del(this._getKey(keyName));
  }

  setKeyExpiration(expiration, keyName, keyValue) {
    if (typeof keyValue === 'object') {
      keyValue = JSON.stringify(keyValue);
    }
    return this.provider.set(this._getKey(keyName), keyValue, "EX", expiration);
  }

  /**
   * 
   * @param {*} filter :- Can either be a wildcard like expression 'whatever*' or an array of keys we want to get
   * @param {*} asObject 
   */
  getKeysValues(filter, asObject) {
    const keyPromise = Array.isArray(filter) && 
      Promise.resolve(filter.map(this._getKey) || this.provider.keys(this._getKey(filter)));

    return keyPromise.then(keys => {
      // TODO
    });
  }

  _connectToPersistenceProvider() {
    const storage = new redis(
      this.connectParams, { connectTimeout: this.CONNECT_TIMEOUT, logLevel: this.logLevel }); // 2nd parameter can probably be omitted.
    const connectTimeoutInterval = setInterval(() => {
      throw new Error(this.TIMEOUT_ERROR);
    }, this.CONNECT_TIMEOUT);

    storage.on('ready', () => {
      console.log('Successfully connected to Redis and DB is ready.');
      clearInterval(connectTimeoutInterval);
    });
    return storage;
  }

  _getKey(key) {
    return `${this.PREFIX}${key}`;
  }

  _getLockKey(key) {
    return `${this.getKey(key)}${this.LOCK_SUFFIX}`;
  }

}

module.exports = ServerPersistence;
