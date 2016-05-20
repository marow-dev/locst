var ls = function () {
    'use strict';
    if ( ! storageAvailable('localStorage')) {
        throw "Web storage is not supported";
    }

    var store = localStorage;

    function storageAvailable(type) {
        try {
            var storage = window[type],
            x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return false;
        }
    }

    /**
     * Is local storage empty
     * 
     * @method empty
     * @return {Boolean} Returns true if local storage is empty
     */
    function empty() {
        return store.length === 0;
    }

    /**
     * List of keys
     *
     * @method keys
     * @return {Array} Returns array of keys defined in local storage
     */
    function keys() {
        var keys = [];
        if ( ! empty()) {
            for (var i = 0; i <= store.length - 1; i++) {
                keys.push(store.key(i));
            }
        }
        return keys;
    }

    /**
     * Number of stored keys
     *
     * @method count
     * @return {Integer}
     */
    function count() {
        return store.length;
    }

    /**
     * Check if key exists
     *
     * @method keyExists
     * @param {String} key Key name to be checked
     * @return {Boolean}
     */
    function keyExists(key) {
        var keys = this.keys();
        return keys.indexOf(key) != -1 ? true : false;
    }

    /**
     * Remove keys
     *
     * @method remove
     * @param {String}{Array} keys Key name or list of keys
     * @return {Boolean}
     */
    function remove(keys) {
        if (typeof keys === 'object') {
            keys.forEach(function (v) {
                store.removeItem(v);
            });
        } else {
            store.removeItem(keys);
        }
        return true;
    }

    /**
     * Returns value by index
     *
     * @method getByIndex
     * @param {Integer} index Index of stored key
     * @return Returns value stored in index
     */
    function getByIndex(index) {
        var key = store.key(index);
        if (key) {
            return getItem(key);
        }
    }

    /**
     * Returns all stored values
     *
     * @method getAll
     * @return {Object} Lista of stored key - value pairs
     */
    function getAll() {
        var ret = {};
        if ( ! empty()) {
            keys().forEach(function (k) {
                ret[k] = getItem(k);
            });
        }
        return ret;
    }

    /**
     * Return value stored in specified key or keys
     *
     * @method get
     * @param {String}{Array} keys Key name or list of keys
     * @return Value stored in key or object with key - value pairs
     */
    function get(keys) {
        var ret = false;
        if (typeof keys === 'object') {
            keys.forEach(function (v) {
                ret[v] = getItem(v);
            });
        } else {
            ret = getItem(keys);
        }
        return ret;
    }

    /**
     * Return value stored in key
     *
     * @method getItem
     * @param {String} key Key name
     * @return
     */
    function getItem(key) {
        return JSON.parse(store.getItem(key));
    }

    /**
     * Saves value in key
     *
     * @method setItem
     * @param {String} key Key name
     * @param value Value
     * @return {Boolean}
     */
    function setItem(key, value) {
        var r = true;
        try { 
            store.setItem(key, value);
        }
        catch (err) {
            r = false;
        }
        return r;
    }

    /**
     * Saves value in specified key
     *
     * @method set
     * @param {String} key
     * @param value
     * @return {Boolean}
     */
    function set(key, value) {
        return setItem(key, JSON.stringify(value));
    }

    /**
     * Executes function on all stored values
     *
     * @method each
     * @param {Function} f
     */
    function each(f) {
        if (typeof f === 'function' && ! empty()) {
            keys().forEach(function (k) {
                var v = get(k);
                f(k, v);
            });
        }
    }

    /**
     * Removed all key - value pairs
     *
     * @method clear
     */
    function clear() {
        store.clear();
    }

    return {
        keys: keys,
        empty: empty,
        count: count,
        keyExists: keyExists,
        get: get,
        getAll: getAll,
        set: set,
        remove: remove,
        each: each,
        clear: clear,
        [Symbol.iterator]: function() {
            var index = 0;
            return {
                next: function () {
                    var value = getByIndex(index);
                    var done = index >= store.length;
                    index++;
                    return {value, done};
                }
            }
        }
    };
}();