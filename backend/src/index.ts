import pg from 'pg';
import Multer from 'multer';

import dotenv from 'dotenv';

import routes from './routes/index.js';
import App from './app.js';
import Services from './services/index.js';

dotenv.config();

type AppConfig = Readonly<{
  prefix: string;
  port: string;
}>

const init = (config: AppConfig) => {
  const pool = new pg.Pool();
  const app = App();
  const services = Services({ pool });
  const upload = Multer({dest: 'uploads/'});

  routes(config.prefix, { app, pool, services, upload });

  app.listen(config.port, () => {
    console.log(`⚡️[server]: Server is running`);
  });

  return app;
}

init({
  port: process.env.PORT ?? '8080',
  prefix: '/api'
});
