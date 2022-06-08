import { Response, Request } from "express";
import jwt from 'jsonwebtoken';

import type { ServiceCreator, MakeServiceFN } from "./index.js"
import { isEmpty, isNil, isObjectWithKeys } from "../utils/guards.js";
import { Nullable } from "../utils/types.js";

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

type DecodeTokenReturnValue = Nullable<Readonly<{
  email: string;
}>>

const makeDecodeToken: MakeServiceFN<Nullable<string>, DecodeTokenReturnValue, AuthServiceConfig> = (_, config) => (
  token
) => {
  if (isNil(token)) {
    return null;
  }

  try {
    const verified = jwt.verify(token, config.jwt.key);

    if (isObjectWithKeys(verified, ['email'])) {
      return { email: verified.email };
    }

    return null;
  } catch {
    return null;
  }
}

const makeIsLoggedIn: MakeServiceFN<Nullable<string>, boolean, AuthServiceConfig> = (_, config) => (
  token
) => {
  if (isNil(token)) {
    return false;
  }

  try {
    const verified = jwt.verify(token, config.jwt.key);
    return !isEmpty(verified) && isObjectWithKeys(verified, ['email']);
  } catch {
    return false;
  }
}

const makeGetToken: MakeServiceFN<Request, Nullable<string>, AuthServiceConfig> = (_, config) => (
  request
) => {
  return request.cookies[config.authCookieName]
}

export type AuthService = Readonly<{
  login: ReturnType<typeof makeLogin>;
  isLoggedIn: ReturnType<typeof makeIsLoggedIn>;
  decodeToken: ReturnType<typeof makeDecodeToken>;
  getToken: ReturnType<typeof makeGetToken>
}>

const makeAuthService: ServiceCreator<AuthService, AuthServiceConfig> = (config, serviceConfig) => ({
  login: makeLogin(config, serviceConfig),
  isLoggedIn: makeIsLoggedIn(config, serviceConfig),
  decodeToken: makeDecodeToken(config, serviceConfig),
  getToken: makeGetToken(config, serviceConfig),
})

export default makeAuthService;
