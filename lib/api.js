const Store = require("./store");

class NodeLocalCache {
  constructor(directory = null) {
    this._store = new Store(directory);
  }

  has(key) {
    return this._store.checkPayload(key);
  }

  get(key, defaultValue = null) {
    return this._store.getPayload(key) || defaultValue;
  }

  pull(key, defaultValue = null) {
    const cache_value = this.get(key, defaultValue);
    this.forget(key);
    return cache_value;
  }

  async rememberAsync(key, seconds, callback) {
    if (!this.has(key)) {
      const value = await callback();
      this._store.put(key, value, seconds);
    }

    return this.get(key);
  }

  remember(key, seconds, callback) {
    const value = this.get(key);
    if (value) {
      return value;
    }

    const callback_value = callback();
    return this._store.put(key, callback_value, seconds);
  }

  forever(key, value) {
    return this._store.put(key, value, 0);
  }

  put(key, value, seconds = 0) {
    return this._store.put(key, value, seconds);
  }

  add(key, value, seconds = 0) {
    const cache_value = this.get(key);
    if (cache_value === null) {
      this._store.put(key, value, seconds);
      return true;
    }

    return false;
  }

  forget(key) {
    this._store.forget(key);
  }

  clear() {
    this._store.clear();
  }
}

module.exports = NodeLocalCache;
