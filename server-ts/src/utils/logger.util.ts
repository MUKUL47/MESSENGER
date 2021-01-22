import winston from 'winston'
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/info.log', level : 'info' }),
    ],
  });
   
  if (process.env.MODE === 'DEV') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  export default logger