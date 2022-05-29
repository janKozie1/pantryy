import { Router } from 'express';
import { Pool } from 'pg';
import { App } from '../app';
import { withPrefix } from '../utils/routes';

import auth from './auth';

type RouterInitializerConfig = Readonly<{
  app: App;
  pool: Pool;
}>

export type RouteInitializer = (prefix: string, config: RouterInitializerConfig) => void;

const routes: RouteInitializer = (prefix, config) => {
  auth(withPrefix(prefix, '/auth'), config);
}

export default routes;
