import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppConfig } from './index.js';

export type App = ReturnType<typeof express>;

const getApp = (config: AppConfig): App => {
  const app = express();

  app.use(config.staticContent.endPoint, express.static(config.staticContent.filePath));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(cookieParser())

  return app;
}

export default getApp;
