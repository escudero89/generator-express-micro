'use strict';

var generators = require('yeoman-generator');
var crypto = require('crypto');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname // Default to current folder name
    }, function (answers) {
      this.log(answers.name);
      this.newAppname = answers.name;

      done();
    }.bind(this));
  },

  writing: function() {
    var commonEnv = {
      appName: this.newAppname,
      appSecret: crypto.randomBytes(64).toString('hex')
    };

    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app/app.js'),
      commonEnv
    );

    this.fs.copyTpl(
      this.templatePath('config.js'),
      this.destinationPath('app/config.js'),
      commonEnv
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      commonEnv
    );

    this.fs.copyTpl(
      this.templatePath('deploy/_upstart-script.conf'),
      this.destinationPath('deploy/' + commonEnv.appName + '.conf'),
      commonEnv
    );

    this.fs.copy(
      this.templatePath('_eslintrc'),
      this.destinationPath('.eslintrc')
    );

    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('Gruntfile.js'),
      this.destinationPath('Gruntfile.js')
    );

    this.fs.copy(
      this.templatePath('middlewares/errors.js'),
      this.destinationPath('app/middlewares/errors.js')
    );

    this.fs.copy(
      this.templatePath('routes.js'),
      this.destinationPath('app/routes.js')
    );

    this.fs.copy(
      this.templatePath('commons.js'),
      this.destinationPath('app/commons.js')
    );

    this.composeWith('express-micro:controller', {arguments: ['default']});
    this.composeWith('express-micro:service', {arguments: ['default']});
    this.composeWith('express-micro:repository', {arguments: ['default']});


    this.config.save();
  },

  install: function() {
    this.installDependencies({ bower: false });
  }
});
