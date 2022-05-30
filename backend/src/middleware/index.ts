import { RequestHandler } from "express";
import { Services } from "../services";

type Config = Readonly<{
  services: Services;
}>

export type Middleware = (config: Config) => RequestHandler
