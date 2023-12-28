'use strict';

module.exports = {
  'secret': process.env.SECRET,
  mongoURI: process.env.DB_URI,
  environment: process.env.ENVIRONMENT,
  roles: {
    USER: 'user',
    ADMIN: 'admin',
    PM: 'pm'
  }
};
