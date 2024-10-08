import Express from "express";
import mysql from 'mysql2';
import StatsD from 'node-statsd';
import { createPool } from 'mysql2/promise';
import assignmentRoutes from "./routes/assignmentRoutes.js";
import userRouter from "./routes/userRoutes.js";
//import healthRoutes from './routes/healthRoutes.js'
import { bootstrap } from "./services/userService.js";
import {logger} from "./packer/logger.js";
import dotenv from 'dotenv';


dotenv.config()
export const app = Express();
const PORT = 3001;

const client = new StatsD({
  errorHandler: function (error) {
    console.error("StatsD error: ", error);
  }
});

//-----------------------------------------------------------
app.use(Express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,x-access-token"
  );
  next();
});

app.use(userRouter);
app.use(assignmentRoutes);


const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10, 
});


//app.use(healthRoutes);
//--------------------------
app.get("/healthz", async (req, res) => {
  logger.info("healthz is up!");

  let isHealthy = false;
  const connection = await pool.getConnection();
  /* var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  }); */

 //console.log(process.env.MYSQL_HOST,process.env.MYSQL_USER,process.env.MYSQL_PASSWORD,process.env.MYSQL_DATABASE);
  if (Object.keys(req.body).length !== 0) {
    return res.status(400).json();
  }
  if (Object.keys(req.query).length !== 0) {
    return res.status(400).json();
  }


  if (connection) {
    isHealthy = true;
    console.log("healthy",isHealthy);
    connection.release();
  } else {
    isHealthy = false;
    console.log(err);
  } 
 /*  connection.connect(function (err) {
    if (err) {
      isHealthy = false;
    } else {
      isHealthy = true;
    }
 */
    if (isHealthy) {
      
      res.setHeader("Cache-Control", "no-cache", "no-store", "must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("X-Content-Type-Options", "nosniff");

      console.log("Connection Established!");

      logger.info("healthz is up woah!");
      client.increment('endpoint.healthz.hits');
      
      connection.release();

      return res.status(200).json();
    } else {
      console.log("Connection Interrupted!");
      logger.info("healthz is down my dear!");
      return res.status(503).json();
    }

  });

//---------------------------
app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});

bootstrap();
export default app;