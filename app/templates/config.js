'use strict';

var environments = {
  production: {
    api: {
      host: '0.0.0.0',
      port: 80,
      clusterPidsDir: '/var/run/<%= appName %>',
      monPort: 3000
    },
    jwt: {
      secret: process.env.JWT_SECRET || '<%= appSecret %>',
      credentialsRequired: false
    },
    logging: {
      name: '<%= appName %>',
      level: 'error'
    }
  },

  development: {
    api: {
      host: 'localhost',
      port: 3000
    },
    jwt: {
      secret: process.env.JWT_SECRET || '<%= appSecret %>',
      credentialsRequired: false
    },
    logging: {
      name: '<%= appName %>',
      level: 'debug'
    }
  }
};


module.exports = environments[process.env.NODE_ENV] || environments.development;
