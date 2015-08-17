'use strict';

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The service name'
    });
  },

  writing: function () {
  	var commonEnv = {
  	  name: this.name
    };

    this.fs.copyTpl(
      this.templatePath('default.js.ejs'),
      this.destinationPath('app/services/' + this.name + '.js'),
      commonEnv
    );

  }
});