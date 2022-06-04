import type { ServiceCreator, MakeServiceFN, SharedServicesConfig } from "."
import { getCookie, removeCookie } from "../utils/cookies";
import { isEmpty } from "../utils/guards";
import type { Nullable } from "../utils/types";
import type { RequestResponse } from "./requests";

type AuthServiceConfig = Readonly<{
  authCookieName: string;
  redirect: Readonly<{
    toLogin: () => void;
  }>
  requestEndpoints: Readonly<{
    login: string;
    register: string;
  }>
}>

type LoginRequest = Readonly<{
  email: string;
  password: string;
}>

type LoginResponse = RequestResponse<LoginRequest>;

const makeLogin: MakeServiceFN<LoginRequest, Promise<Nullable<LoginResponse>>, AuthServiceConfig> = ({sendJSON}, {requestEndpoints}) => async (
  data
) => {
  try {
    const response = await sendJSON(requestEndpoints.login, {
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    });

    if (response.ok) {
      const body: LoginResponse = await response.json();
      return body;
    }

    return null;
  } catch {
    return null;
  }
}

type RegisterRequest = Readonly<{
  email: string;
  password: string;
  repeatedPassword: string;
}>

type RegisterResponse = RequestResponse<RegisterRequest>;

const makeRegister: MakeServiceFN<RegisterRequest, Promise<Nullable<RegisterResponse>>, AuthServiceConfig> = ({sendJSON}, {requestEndpoints }) => async(
  data
) => {
  try {
    const response = await sendJSON(requestEndpoints.register, {
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        repeatedPassword: data.repeatedPassword
      })
    });

    if (response.ok) {
      const body: RegisterResponse = await response.json();

      return body;
    }

    return null;
  } catch {
    return null;
  }
}

const makeIsLoggedIn: MakeServiceFN<unknown, Boolean, AuthServiceConfig> = (_, {authCookieName}) => () => !isEmpty(getCookie(authCookieName));

const makeLogout: MakeServiceFN<unknown, void, AuthServiceConfig> = (_, {authCookieName, redirect}) => () => {
  removeCookie(authCookieName);
  redirect.toLogin();
};


export type AuthService = Readonly<{
  login: ReturnType<typeof makeLogin>;
  register: ReturnType<typeof makeRegister>;
  isLoggedIn: ReturnType<typeof makeIsLoggedIn>;
  logout: ReturnType<typeof makeLogout>;
}>

const makeAuthService: ServiceCreator<AuthService, AuthServiceConfig> = (config, serviceConfig) => ({
  login: makeLogin(config, serviceConfig),
  register: makeRegister(config, serviceConfig),
  isLoggedIn: makeIsLoggedIn(config, serviceConfig),
  logout: makeLogout(config, serviceConfig),
})

export default makeAuthService;
