Declarative validation for javascript.

## Install

[![Greenkeeper badge](https://badges.greenkeeper.io/wookets/javascript-validate.svg)](https://greenkeeper.io/)

In package.json,

```"validate": "https://github.com/wookets/javascript-validate/tarball/0.1.1"```

## Node Usage

```
var validate = require('validate');

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

var errors = validate(document, schema);

if (errors) {
  // errors happened, this is an array of what went wrong
}

// false was returned from validate, which means no errors so continue on


```


## Other resources

* http://validatejs.org/ - a similar project but with different syntax / features
