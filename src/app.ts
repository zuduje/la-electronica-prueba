let createError = require('http-errors');
import express, { Express, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import morgan, { StreamOptions } from "morgan";
import Logger from './lib/logger';
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import 'dotenv/config';

import indexRouter from './routes';
import usersRouter from './routes/users';
import authorizationsRouter from "./routes/authorizations";
import messagesRouter from "./routes/messages";
import setHeaders from "./middlewares/cords.middleware";

let app = express();

//agregacion de los cords del servicio
app.use(setHeaders);

//importar las variables de ambiente
require('dotenv').config();

//Configuration of helmet
app.use(helmet());
//Seguridad para ataques XSS
app.use(helmet.xssFilter());

// parse application/json with bodyParser
app.use(bodyParser.json());

// compression of gzip for all routes
app.use(compression());

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => Logger.http(message),
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define message format string (this is the default one).
// The message format is made from tokens, and each token is
// defined inside the Morgan library.
// You can create your custom token to show what do you want from a request.
// Options: in this case, I overwrote the stream and the skip logic.
// See the methods above.
app.use(morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream, skip }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/authorization', authorizationsRouter);
app.use('/api/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err:any, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app
