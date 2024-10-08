
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT, // Use the value from .env or default to 'mysql'
  host: process.env.MYSQL_HOST, // Use the value from .env or default to 'localhost'
  username: process.env.MYSQL_USER, // Use the value from .env or default to 'root'
  password: process.env.MYSQL_PASSWORD , // Use the value from .env or default to 'password'
  database: process.env.MYSQL_DATABASE, // Use the value from .env or default to 'sys'
});



export default sequelize;