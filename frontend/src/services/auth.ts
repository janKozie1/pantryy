import type { ServiceCreator, MakeServiceFN } from "."

type AuthServiceConfig = Readonly<{
  requestEndpoints: Readonly<{
    login: string;
    register: string;
  }>
}>

type LoginRequest = Readonly<{
  email: string;
  password: string;
}>

const makeLogin: MakeServiceFN<LoginRequest, void, AuthServiceConfig> = ({fetch}, {requestEndpoints}) => async (
  data
) => {
  try {
    const response = await fetch(requestEndpoints.login, {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    });

    const body: unknown = await response.json();
    console.log(body);
  } catch {
    return null;
  }
}

type SignupRequest = Readonly<{
  email: string;
  password: string;
  repeatedPassword: string;
}>

export type AuthService = Readonly<{
  login: ReturnType<typeof makeLogin>
}>

const makeAuthService: ServiceCreator<AuthService, AuthServiceConfig> = (config, serviceConfig) => ({
  login: makeLogin(config, serviceConfig),
})

export default makeAuthService;
