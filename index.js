
var _ = require('lodash');

module.exports = function(document, schema, options) {
  var errors = {};
  var path = '';

  function validateDoc(doc, sch) {
    if (!_.isEmpty(path)) path += '.'; // means nested
    for (var property in sch) {
      var def = sch[property];
      var value = doc[property];
      // set path
      path += property;
      //
      // default
      if (_.has(def, 'default') && _.isUndefined(value)) {
        if (_.isFunction(def.default)) {
          value = def.default(document);
        } else {
          value = def.default;
        }
        doc[property] = value;
      }
      //
      // convert
      if (_.has(def, 'convert') && def.convert) {
        value = def.convert(value);
        doc[property] = value;
      }
      //
      // required
      if (_.has(def, 'required') && def.required) {
        if (!exists(value)) {
          errors[path] = {required: true};
        }
      }
      // type
      //console.log('def', name, def, value);
      switch (def.type) {
        case 'array':
        case Array:
          if (value && !_.isArray(value)) {
            errors[path] = {type: 'array'};
          }
          break;
        case 'bool':
        case 'boolean':
        case Boolean:
          if (!_.isUndefined(value) && !_.isBoolean(value)) {
            errors[path] = {type: 'boolean'};
          }
          break;
        case 'date':
        case Date:
          if (value && !_.isDate(value)) {
            errors[path] = {type: 'date'};
          }
          if (_.has(def, 'before') && value) {
            // TODO handle if function passed in
            if (value > def.before) {
              errors[path] = {before: def.before};
            }
          }
          if (_.has(def, 'after') && value) {
            // TODO handle if function passed in
            if (value < def.after) {
              errors[path] = {after: def.after};
            }
          }
          break;
        case 'number':
        case Number:
          if (value && !_.isNumber(value)) {
            errors[path] = {type: 'number'};
            break;
          }
          // min
          if (_.has(def, 'min') && exists(value) && value < def.min) {
            errors[path] = {min: def.min};
          }
          // max
          if (_.has(def, 'max') && exists(value) && value > def.max) {
            errors[path] = {max: def.max};
          }
          break;
        case 'string':
        case String:
          // validate type
          if (value && !_.isString(value)) {
            errors[path] = {type: 'string'};
            break;
          }
          // trim support
          if (_.has(def, 'trim') && exists(value) && def.trim) {
            doc[property] = value.trim();
          }
          // min
          if (_.has(def, 'min') && exists(value) && value.length < def.min) {
            errors[path] = {min: def.min};
          }
          // max
          if (_.has(def, 'max') && exists(value) && value.length > def.max) {
            errors[path] = {max: def.max};
          }
          // enum
          if (_.has(def, 'enum') && !_.contains(def.enum, value)) {
            errors[path] = {enum: def.enum};
          }
          // blacklist
          if (_.has(def, 'blacklist') && _.contains(def.blacklist, value)) {
            errors[path] = {blacklist: def.blacklist};
          }
          // match (regex)
          if (_.has(def, 'match') && exists(value) && !def.match.test(value)) {
            errors[path] = {match: def.match};
          }
          break;
        default:
          validateDoc(value, def);
          break;
      }
      //
      // unset path
      path = path.substring(0, path.length - property.length);
    }
    if (path.indexOf('.') === path.length - 1) {
      path = path.substring(0, path.length - 1);
    }
  }

  validateDoc(document, schema);

  if (_.isEmpty(errors)) return false;
  return errors;
}


function exists(value) {
  if (_.isUndefined(value)) return false;
  if (_.isNull(value)) return false;
  if ((_.isString(value) || _.isArray(value)) && _.isEmpty(value)) return false;
  return true;
}

