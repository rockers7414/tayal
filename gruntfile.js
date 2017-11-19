'use strict';

module.exports = function(grunt) {
  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt'),
    init: true,
    data: {},
    loadGruntTasks: {
      pattern: 'grunt-*',
    }
  });

  // Default task
  grunt.registerTask('default', ['eslint', 'nodemon']);
};
