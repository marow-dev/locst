var ls = function () {
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

    function empty() {
        return store.length === 0;
    }

    function keys() {
        var keys = [];
        if ( ! empty()) {
            for (var i = 0; i <= store.length - 1; i++) {
                keys.push(store.key(i));
            }
        }
        return keys;
    }

    function count() {
        return store.length;
    }

    function keyExists(key) {
        var keys = this.keys();
        return keys.indexOf(key) != -1 ? true : false;
    }

    function remove(keys) {
        if (typeof keys === 'object') {
            keys.forEach(function (v) {
                store.removeItem(v);
            });
        } else {
            store.removeItem(keys);
        }
    }

    function getByIndex(index) {
        var key = store.key(index);
        if (key) {
            return store.getItem(key);
        }
    }

    function getAll() {
        var ret = {};
        if ( ! empty()) {
            keys().forEach(function (k) {
                ret[k] = store.getItem(k);
            });
        }
        return ret;
    }

    function get(keys) {
        var ret = false;
        if (typeof keys === 'object') {
            keys.forEach(function (v) {
                ret[v] = store.getItem(v);
            });
        } else {
            ret = store.getItem(keys);
        }
        return ret;
    }

    function set(key, value) {
        return store.setItem(key, value);
    }

    function each(f) {
        if (typeof f === 'function' && ! empty()) {
            keys().forEach(function (k) {
                var v = get(k);
                f(k, v);
            });
        }
    }

    function clear() {
        store.clear();
    }

    return {
        keys: keys,
        empty: empty,
        count: count,
        keyExists: keyExists,
        get: get,
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