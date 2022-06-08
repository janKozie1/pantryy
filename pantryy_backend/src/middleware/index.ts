import { RequestHandler } from 'express';
import { Services } from '../services/index.js';

type Config = Readonly<{
  services: Services;
}>

export type Middleware = (config: Config) => RequestHandler
