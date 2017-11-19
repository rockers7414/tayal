'use strict';

var files = [
  './src/**/*.js'
];

module.exports = {
  options: {
    configFile: './.eslintrc.json'
  },
  local: {
    files: {
      src: files
    }
  }
};
