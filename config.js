const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  nodeEnv: process.env.NODE_ENV,
  portNum: process.env.PORT, 
  prodHost: process.env.DB_HOST_PROD, 
  prodUser: process.env.DB_USER_PROD, 
  prodPassword: process.env.DB_PASSWORD_PROD,
  prodDB: process.env.DB_DATABASE_PROD,
  devHost: process.env.DB_HOST_DEV, 
  devUser: process.env.DB_USER_DEV, 
  devPassword: process.env.DB_PASSWORD_DEV, 
  devDB: process.env.DB_DATABASE_DEV
};