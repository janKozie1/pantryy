import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

export type App = ReturnType<typeof express>;

const getApp = (): App => {
  const app = express();

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(cookieParser())

  return app;
}

export default getApp;
