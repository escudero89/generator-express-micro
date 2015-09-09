'use strict';

var generators = require('yeoman-generator');
var crypto = require('crypto');
var slugify = require('underscore.string/slugify');

var chalk = require('chalk');
var yosay = require('yosay');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.log(yosay('Welcome to the splendid ' + chalk.green('Express-Micro') + ' generator!'));
    this.log('I will generate the scaffolding for a new and shiny API. Let\'s go for it!');
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
      this.slug = slugify(answers.name);

      done();
    }.bind(this));
  },

  writing: function() {
    var commonEnv = {
      appName: this.newAppname,
      appSlug: this.slug,
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
  },

  end: function() {
    this.log(yosay('My work here is ' + chalk.bold(chalk.green('done')) + '!'));
    this.log('Run ' + chalk.red('npm start') + ' to see the app in action or ' + chalk.red('npm start | bunyan') + ' for a better info display.');
    this.log('Visit our source code at ' + chalk.blue('https://github.com/pcostesi/generator-express-micro'));
  }
});
