'use strict';

var generators = require('yeoman-generator')
  , esprima = require('esprima')
  , Promise = require('bluebird')
  ;


function parseAst(file) {
  return esprima.parse(file, {
    comment: true,
    loc: true
  });
}

function findRouteInsertionPoint (file) {
  var i
    , ast = parseAst(file)
    , comment
    , comments = ast.comments
    , regex = /generator - insert routes here/gi
    ;

  for (i = 0; i < comments.length; i++) {
    comment = comments[i];
    if (comment.value.match(regex)) {
      return comment.loc.start.line;
    }
  }
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
      return response != '';
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
    var done = this.async()
      , prompter = this
      , extras = [prompts.askForMethod, prompts.askForRoute]
      ;

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
      var path = this.destinationPath('app/routes.js')
        , file = this.fs.read(path)
        , point = findRouteInsertionPoint(file)
        , insertion
        , contents = file.toString().split('\n')
        ;

      insertion = ('router.' + this.method +
        "('" + this.route + "', controller('" + this.name + "'));");

      contents.splice(point, 0, insertion);

      this.fs.write(path, contents.join('\n'));
    }
  }
});
