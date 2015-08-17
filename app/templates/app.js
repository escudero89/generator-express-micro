'use strict';

var routes = require('./routes.js')
  , express = require('express')
  , cors = require('cors')
  , config = require('./config.js')
  , jwt = require('express-jwt')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , http = require('http')
  , Cluster = require('cluster')
  , bunyan = require('bunyan')
  , errorMiddleware = require('./middlewares/errors.js')
  , expressLogger = require('express-bunyan-logger')
  ;

var app = express()
  , logger = bunyan.createLogger(config.logging)
  ;

app.use(cors(config.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(jwt(config.jwt));

app.use(expressLogger(config.logging));

app.use('/api/v1', routes);

app.use(errorMiddleware(config.logging));

function serve(application) {
  var server = http.createServer(application);
  if (process.env.NODE_ENV === 'production') {
    new Cluster({
      port: config.api.port,
      pids: config.api.clusterPidsDir,
      monPort: config.api.clusterMonitoringPort
    }).listen(function (cb) {
      logger.info('Cluster node ready on port ' + config.api.port);
      cb(server);
    });
  } else {
    server.listen(config.api.port, function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }
      logger.info('Express server listening on port ' + config.api.port);
    });
  }
}

serve(app);
