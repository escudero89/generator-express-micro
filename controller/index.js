'use strict';

var generators = require('yeoman-generator');
var esprima = require('esprima');
var Promise = require('bluebird');

function parseAst(file) {
  return esprima.parse(file, {
    comment: true,
    loc: true
  });
}

function findRouteInsertionPoint(file) {
  var ast = parseAst(file);
  var comments = ast.comments;
  var regex = /generator - insert routes here/gi;

  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    if (comment.value.match(regex)) {
      return comment.loc.start.line;
    }
  }
}

function sanitizeRoute(route) {
  var trimmed = route.trim();

  if (trimmed[0] !== '/') {
    trimmed = '/' + trimmed;
  }

  return trimmed;
}

var prompts = {
  askForController: {
    type: 'confirm',
    name: 'addRoute',
    message: 'Do you want to add a route to this controller?',
    default: true // Default to current folder name
  },

  askForRoute: {
    type: 'input',
    name: 'route',
    message: 'Path to route?',
    default: '/',
    validate: function(response) {
      // Check for invalid chars in the route
      return !response.match(/[,;]/);
    }
  },

  askForMethod: {
    type: 'list',
    name: 'method',
    message: 'Method?',
    choices: ['get', 'post', 'put', 'delete'],
    default: 'get' // Default to current folder name
  },

};

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The controller name'
    });
  },

  prompting: function() {
    var done = this.async();
    var prompter = this;
    var extras = [prompts.askForMethod, prompts.askForRoute];

    function doneAsking(answers) {
      prompter.route = answers.route;
      prompter.method = answers.method;
      return done();
    }

    this.prompt(prompts.askForController, function (answers) {
      if (!answers.addRoute) {
        return done();
      }

      prompter.addRoute = answers.addRoute;
      prompter.prompt(extras, doneAsking);
    });
  },

  writing: function() {

    var commonEnv = {
      controllerName: this.name
    };

    this.fs.copyTpl(
      this.templatePath('default.js.ejs'),
      this.destinationPath('app/controllers/' + this.name + '.js'),
      commonEnv
    );

    if (this.addRoute) {
      var path = this.destinationPath('app/routes.js');
      var file = this.fs.read(path);
      var point = findRouteInsertionPoint(file);
      var contents = file.toString().split('\n');

      // We

      var insertion = ('router.' + this.method +
        "('" + sanitizeRoute(this.route) + "', controller('" + this.name + "'));");

      contents.splice(point, 0, insertion);

      this.fs.write(path, contents.join('\n'));
    }
  }
});
