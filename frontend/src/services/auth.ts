import type { ServiceCreator, MakeServiceFN, SharedServicesConfig } from "."
import { getCookie } from "../utils/cookies";
import { isEmpty } from "../utils/guards";
import type { Nullable } from "../utils/types";

type AuthServiceConfig = Readonly<{
  authCookieName: string;
  requestEndpoints: Readonly<{
    login: string;
    register: string;
  }>
}>

type RequestResponse<T> = Readonly<{
  ok: boolean;
  errors: Partial<{
    [key in keyof T]: string
  }>
}>

const makeSendJSON = (scopedFetch: SharedServicesConfig['fetch']):  SharedServicesConfig['fetch'] => (...args) => {
  const [url, params] = args;

  return scopedFetch(url, {
    ...params,
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: params.body,
  })
}

type LoginRequest = Readonly<{
  email: string;
  password: string;
}>

type LoginResponse = RequestResponse<LoginRequest>;

const makeLogin: MakeServiceFN<LoginRequest, Promise<Nullable<LoginResponse>>, AuthServiceConfig> = ({fetch}, {requestEndpoints}) => async (
  data
) => {
  try {
    const response = await makeSendJSON(fetch)(requestEndpoints.login, {
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

const makeIsLoggedIn: MakeServiceFN<unknown, Boolean, AuthServiceConfig> = (_, {authCookieName}) => () => !isEmpty(getCookie(authCookieName));

type SignupRequest = Readonly<{
  email: string;
  password: string;
  repeatedPassword: string;
}>

export type AuthService = Readonly<{
  login: ReturnType<typeof makeLogin>;
  isLoggedIn: ReturnType<typeof makeIsLoggedIn>;
}>

const makeAuthService: ServiceCreator<AuthService, AuthServiceConfig> = (config, serviceConfig) => ({
  login: makeLogin(config, serviceConfig),
  isLoggedIn: makeIsLoggedIn(config, serviceConfig),
})

export default makeAuthService;
