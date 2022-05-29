import express from 'express';
import bodyParser from 'body-parser';

export type App = ReturnType<typeof express>;

const getApp = (): App => {
  const app = express();

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  return app;
}

export default getApp;
