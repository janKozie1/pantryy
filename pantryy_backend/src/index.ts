import pg from 'pg';
import Multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';

import dotenv from 'dotenv';

import routes from './routes/index.js';
import App from './app.js';
import Services from './services/index.js';

dotenv.config();

export type AppConfig = Readonly<{
  prefix: string;
  port: string;
  staticContent: {
    filePath: string;
    endPoint: '/static',
  };
  uploads: {
    folder: string;
  }
}>

const init = (config: AppConfig) => {
  const pool = new pg.Pool();
  const app = App(config);
  const upload = Multer({ dest: path.join(config.staticContent.filePath, config.uploads.folder) });

  const services = Services({
    pool,
    filesConfig: { staticEndpoint: config.staticContent.endPoint, uploadedImagesFolder: config.uploads.folder },
  });

  routes(config.prefix, {
    app, pool, services, upload,
  });

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(config.staticContent.filePath, 'index.html'));
  });

  app.listen(config.port, () => {
    console.log('⚡️[server]: Server is running');
  });

  return app;
};

init({
  port: process.env.PORT ?? '8080',
  prefix: '/api',
  uploads: {
    folder: 'uploads',
  },
  staticContent: {
    endPoint: '/static',
    filePath: join(dirname(fileURLToPath(import.meta.url)), '/static'),
  },
});
