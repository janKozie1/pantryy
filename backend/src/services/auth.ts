import { Response } from "express";
import type { ServiceCreator, MakeServiceFN } from "."

import jwt from 'jsonwebtoken';

type AuthServiceConfig = Readonly<{
  authCookieName: string;
  jwt: {
    key: string;
    expiresInSeconds: number;
  }
}>

type LoginRequest = Readonly<{
  email: string;
  response: Response;
}>

const makeLogin: MakeServiceFN<LoginRequest, void, AuthServiceConfig> = (_, config) => async (
  data
) => {
  const token = jwt.sign({ email: data.email, iat: config.jwt.expiresInSeconds }, config.jwt.key);
  data.response.cookie(config.authCookieName, token, { maxAge: config.jwt.expiresInSeconds * 1000 });
}

export type AuthService = Readonly<{
  login: ReturnType<typeof makeLogin>;
}>

const makeAuthService: ServiceCreator<AuthService, AuthServiceConfig> = (config, serviceConfig) => ({
  login: makeLogin(config, serviceConfig),
})

export default makeAuthService;
