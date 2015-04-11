/**
 * Feature - A JavaScript Module Pattern
 * @author Nate Ferrero
 * @url https://snapplab.com
 */
var Value = function (type, value) {
  var self = this;
  var scope = this['#scope'] = {'#type': type};
  var f = local(type, scope);
  if (value && typeof value === 'object') {
    Object.keys(value).forEach(function (key) {
      setter(type, key, f, scope, value[key]);
    });
  }
  Object.keys(types[type]).forEach(function (key) {
    Object.defineProperty(self, key, {
      get: function () {
        return getter(type, key, f, scope);
      },
      set: function (val) {
       return setter(type, key, f, scope, val);
      },
      enumerable: true
    });

    var property = types[type][key];
    if (property.features) {
      if (Array.isArray(property.features)) {
        scope[key] = new ArrayValue(property.features[0]);
      }
      else if (typeof property.features === 'object') {
        var featureScope = {};
        setter(type, key, f, scope, featureScope);
        Object.keys(property.features).forEach(function (featureKey) {
          if (Array.isArray(property.features[featureKey])) {
            featureScope[featureKey] = new ArrayValue(property.features[0]);
          }
        });
      }
    }
  });
};

Value.prototype.toJSON = function () {
  return this['#scope'];
};

var ArrayValue = function (type) {
  Object.defineProperty(this, '#type', {
    get: function () {
      return type;
    }
  });
};

ArrayValue.prototype = new Array();

ArrayValue.prototype.toJSON = function () {
  return Array.prototype.slice.call(this);
};

ArrayValue.prototype.push = function (data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Argument not compatible with type ' + this['#type']);
  }

  if (!('#type' in data)) {
    data = new Value(this['#type'], data);
  }

  else if (data['#type'] !== this['#type']) {
    throw new Error('Argument provided was of wrong type');
  }

  Array.prototype.push.call(this, data);
};


var types = {};

var setter = function (type, key, f, scope, value) {
  var property = types[type][key];
  if (!property) {
    throw new Error('Property ' + type + '.' + key + ' is not available in this build');
  }
  if (property.set) {
    property.set(f, value);
  }
  scope[key] = value;
};

var getter = function (type, key, f, scope) {
  var property = types[type][key];
  if (!property) {
    throw new Error('Property ' + type + '.' + key + ' is not available in this build');
  }
  if (property.get) {
    return property.get(f);
  }
  return scope[key];
};

var local = function (type, scope) {
  return function (key, f) {
    return getter(type, key, f, scope);
  };
};

var load = function (dir, type, features) {
  features.forEach(function (feature) {
    types[type][feature] = require(dir + '/' + type + '/' + feature + '.js');
  });
  return function (value) {
    return new Value(type, value);
  };
};

module.exports = {
  build: function (dir, config) {
    var mod = {};
    if (!config || typeof config !== 'object') {
      throw new Error('second argument to feature.build(dir, config) must be an object');
    }
    Object.keys(config).forEach(function (key) {
      types[key] = {};
      mod[key] = load(dir, key, config[key]);
    });
    return mod;
  }
};
