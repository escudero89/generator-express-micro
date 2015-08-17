'use strict';

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The middleware name'
    });
  },

  writing: function () {
  	var commonEnv = {
  	  middleware: this.name
    };

    this.fs.copyTpl(
      this.templatePath('middleware.js.ejs'),
      this.destinationPath('app/middlewares/' + this.name + '.js'),
      commonEnv
    );

  }
});