import { Request, Response } from 'express'

import { App } from "../app.js";

type HTTPExpressMethods = 'get' | 'post' | 'delete' | 'patch';
type Handler = (req: Request, res: Response) => unknown;

type AllHandlers = Record<HTTPExpressMethods, Record<string, Handler>>;

const makeMockApp = (): [AllHandlers, App] => {
  const handlers: AllHandlers  = {
    get: {},
    delete: {},
    patch: {},
    post: {},
  };

  const recordHandler = (method: HTTPExpressMethods) => (path: string, ...args: unknown[]) => {
    const handlerFn = args[args.length - 1];
    handlers[method][path] = handlerFn as Handler;
  }

  return [handlers, {
    get: recordHandler('get'),
    post: recordHandler('post'),
    delete: recordHandler('delete'),
    patch: recordHandler('patch'),
  } as unknown as App]
}

export default makeMockApp;
