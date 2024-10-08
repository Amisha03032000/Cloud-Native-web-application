
import { existsSync, mkdir } from 'fs';
import { createLogger, format, transports } from 'winston';
import path from 'path';


const defaultLogDirectory = './log'; 


const logFilePath = path.join(defaultLogDirectory, 'app.log');

if (!existsSync(defaultLogDirectory)) {
  mkdir(defaultLogDirectory, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating log directory:', err);
    }
  });
}

export const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(),
      new transports.File({ filename: logFilePath }),
    ],
  });

