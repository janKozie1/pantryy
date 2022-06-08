import { Pool } from 'pg';
import { Multer } from 'multer';

import { App } from '../app.js';
import { Services } from '../services/index.js';
import { withPrefix } from '../utils/routes.js';

import auth from './auth/index.js';
import pantry from './pantry/index.js';

type RouterInitializerConfig = Readonly<{
  app: App;
  pool: Pool;
  services: Services;
  upload: Multer
}>

export type RouteInitializer = (prefix: string, config: RouterInitializerConfig) => void;

const routes: RouteInitializer = (prefix, config) => {
  auth(withPrefix(prefix, '/auth'), config);
  pantry(withPrefix(prefix, '/pantry'), config);
};

export default routes;
