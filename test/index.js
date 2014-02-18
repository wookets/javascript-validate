
var _ = require('lodash');
var assert = require('assert');

var validate = require('../');

var schema = {
  name: {type: String, trim: true, min: 3, max: 15, required: true},
  active: {type: Boolean, default: true},
  description: {type: String},
  age: {type: Number, min: 0, max: 150},
  sex: {type: String, enum: ['m', 'f'], convert: function(value) { if (value == 'female') return 'f'; return value;}},
  address: {
    street: {type: String},
    state: {type: String, enum: ['CA','MN','NY','FL']},
    zip: {type: String, match: /(^\d{5}$)|(^\d{5}-\d{4}$)/}
  },
  createdOn: {type: Date, required: true, default: new Date()}
}

var document = {
  name: 'Mr Meow Pants',
  description: '<b>Something Great!</b>',
  age: 45,
  sex: 'f',
  active: true,
  address: {
    street: '312 Hover Ave',
    state: 'FL',
    zip: '48392'
  }
}

describe('validate()', function() {

  it('should make sure string is of type string', function(done) {
    var doc = _.cloneDeep(document);
    doc.name = 99;
    var errors = validate(doc, schema);
    assert.equal(errors.name.type, 'string');
    done();
  });

  it('should require name', function(done) {
    var doc = _.cloneDeep(document);
    delete doc.name;
    var errors = validate(doc, schema);
    assert.equal(errors.name.required, true);
    done();
  });

  it('should min a string', function(done) {
    var doc = _.cloneDeep(document);
    doc.name = 'pe';
    var errors = validate(doc, schema);
    assert.equal(errors.name.min, schema.name.min);
    done();
  });

  it('should max a string', function(done) {
    var doc = _.cloneDeep(document);
    doc.name += 'pedkdjksdjlsdjlsdjlisjdlisjdlid';
    var errors = validate(doc, schema);
    assert.equal(errors.name.max, schema.name.max);
    done();
  });

  it('should trim name', function(done) {
    var doc = _.cloneDeep(document);
    doc.name += '     ';
    validate(doc, schema);
    assert.equal(doc.name, document.name);
    done();
  });

  it('should make sure age is a number', function(done) {
    var doc = _.cloneDeep(document);
    doc.age = 'nine';
    var errors = validate(doc, schema);
    assert.equal(errors.age.type, 'number');
    done();
  });

  it('should make sure age is at least 0', function(done) {
    var doc = _.cloneDeep(document);
    doc.age = -5;
    var errors = validate(doc, schema);
    assert.equal(errors.age.min, schema.age.min);
    done();
  });

  it('should make sure active is a boolean', function(done) {
    var doc = _.cloneDeep(document);
    doc.active = 'false';
    var errors = validate(doc, schema);
    assert.equal(errors.active.type, 'boolean');
    done();
  });

  it('should set active default', function(done) {
    var doc = _.cloneDeep(document);
    delete doc.active;
    validate(doc, schema);
    assert(doc.active);
    done();
  });

  it('should test enum', function(done) {
    var doc = _.cloneDeep(document);
    doc.sex = 'male';
    var errors = validate(doc, schema);
    assert.equal(errors.sex.enum, schema.sex.enum);
    done();
  });

  it('should test subdoc state', function(done) {
    var doc = _.cloneDeep(document);
    doc.address.state = 'male';
    var errors = validate(doc, schema);
    assert.equal(errors['address.state'].enum, schema.address.state.enum);
    done();
  });

  it('should test subdoc type', function(done) {
    var doc = _.cloneDeep(document);
    doc.address.street = 31;
    var errors = validate(doc, schema);
    assert.equal(errors['address.street'].type, 'string');
    done();
  });

  it('should test zip match', function(done) {
    var doc = _.cloneDeep(document);
    doc.address.zip = '403932';
    var errors = validate(doc, schema);
    assert.equal(errors['address.zip'].match, schema.address.zip.match);
    done();
  });

  it('should test convert()', function(done) {
    var doc = _.cloneDeep(document);
    doc.sex = 'female';
    var errors = validate(doc, schema);
    assert.equal(doc.sex, 'f');
    done();
  });

  it('should be ok when 0 passed into min', function(done) {
    var doc = _.cloneDeep(document);
    doc.age = 0;
    var errors = validate(doc, schema);
    assert(!errors);
    done();
  });

  it('should be ok when 150 passed into max', function(done) {
    var doc = _.cloneDeep(document);
    doc.age = 150;
    var errors = validate(doc, schema);
    assert(!errors);
    done();
  });
});