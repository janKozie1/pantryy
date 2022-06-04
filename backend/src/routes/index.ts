import { Pool } from 'pg';
import { App } from '../app';
import { Services } from '../services';
import { withPrefix } from '../utils/routes';
import { Multer } from 'multer'

import auth from './auth';
import pantry from './pantry';

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
}

export default routes;
