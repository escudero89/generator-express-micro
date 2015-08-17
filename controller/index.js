'use strict';

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The controller name'
    });
  },

  writing: function () {
  	var commonEnv = {
  	  controllerName: this.name
    };

    this.fs.copyTpl(
      this.templatePath('default.js.ejs'),
      this.destinationPath('app/controllers/' + this.name + '.js'),
      commonEnv
    );

  }
});