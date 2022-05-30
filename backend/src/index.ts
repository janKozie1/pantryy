import { Pool  } from 'pg';

import dotenv from 'dotenv';

import routes from './routes';
import App from './app';
import Services from './services';

dotenv.config();

type AppConfig = Readonly<{
  prefix: string;
  port: string;
}>

const init = (config: AppConfig) => {
  const pool = new Pool();
  const app = App();
  const services = Services();

  routes(config.prefix, { app, pool, services });

  app.listen(config.port, () => {
    console.log(`⚡️[server]: Server is running`);
  });

  return app;
}

init({
  port: process.env.PORT ?? '8080',
  prefix: '/api'
});
