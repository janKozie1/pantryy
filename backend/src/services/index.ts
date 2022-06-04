import { Pool } from 'pg';
import auth from './auth.js';

export type SharedServicesConfig = Readonly<{
  pool: Pool;
}>

export type ServiceCreator<ServiceShape, Config = null> = (
  sharedServicesConfig: SharedServicesConfig, serviceConfig: Config
) => ServiceShape;

export type MakeServiceFN<Data, ReturnValue = void, ServiceConfig = null> = unknown extends Data
  ? (config: SharedServicesConfig, serviceConfig: ServiceConfig) => () => ReturnValue
  : (config: SharedServicesConfig, serviceConfig: ServiceConfig) => (data: Data) => ReturnValue;

type UninitializedServices = Readonly<{
  auth: typeof auth;
}>;

type ServiceSpecificConfigs = Readonly<{
  [service in keyof Omit<UninitializedServices, 'operations'>]:  UninitializedServices[service] extends ServiceCreator<infer T, infer Config> ? Config: never;
}>

export type Services = Readonly<{
  [service in keyof UninitializedServices]: ReturnType<UninitializedServices[service]>
}>

const makeServices = (
  sharedConfig: SharedServicesConfig, specificConfigs: ServiceSpecificConfigs
): Services => {
  const authService = auth(sharedConfig, specificConfigs.auth);

  return ({
    auth: authService,
  })
}

type DynamicConfig = Readonly<{
  pool: Pool
}>

export default (dynamicConfig: DynamicConfig) => makeServices(dynamicConfig, {
  auth: {
    authCookieName: 'auth',
    jwt: {
      expiresInSeconds: 60 * 60 * 24,
      key: ':D',
    }
  },
});
