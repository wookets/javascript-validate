
Modular declarative object validation for node.js

## Install

In package.json, under dependencies, you can do...

```"validate": "https://github.com/wookets/node-validate/0.1.0"```

## Usage

```
var validate = require('validate');

var schema = {
  name: {type: String, required: true},
  description: {type: String},
  age: {type: Number, min: 0, max: 150},
  sex: {type: String, enum: ['m', 'f']},
  active: {type: Boolean, default: true},
  address: {

  },
  createdOn: {type: Date, required: true, default: Date.now}
}

var errors = validate(doc, schema);

if (errors) {
  // errors happened, this is an array of what went wrong
}

// false was returned from validate, which means no errors


```


