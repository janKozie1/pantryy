import { Response } from "express";
import type { ServiceCreator, MakeServiceFN } from "."

import jwt from 'jsonwebtoken';
import { isEmpty } from "../utils/guards";

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

const makeIsLoggedIn: MakeServiceFN<string, boolean, AuthServiceConfig> = (_, config) => (
  token
) => {
  try {
    const verified = jwt.verify(token, config.jwt.key);

    return !isEmpty(verified);
  } catch {
    return false;
  }
}

export type AuthService = Readonly<{
  login: ReturnType<typeof makeLogin>;
  isLoggedIn: ReturnType<typeof makeIsLoggedIn>;
}>

const makeAuthService: ServiceCreator<AuthService, AuthServiceConfig> = (config, serviceConfig) => ({
  login: makeLogin(config, serviceConfig),
  isLoggedIn: makeIsLoggedIn(config, serviceConfig)
})

export default makeAuthService;
