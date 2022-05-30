



import auth from './auth';

export type SharedServicesConfig = Readonly<{
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
  [service in keyof UninitializedServices]: UninitializedServices[service] extends ServiceCreator<infer T, infer Config> ? Config: never;
}>

export type Services = Readonly<{
  [service in keyof UninitializedServices]: ReturnType<UninitializedServices[service]>
}>

const makeServices = (
  sharedConfig: SharedServicesConfig, specificConfigs: ServiceSpecificConfigs
): Services => ({
  auth: auth(sharedConfig, specificConfigs.auth),
})

export default () => makeServices({}, {
  auth: {
    authCookieName: 'auth',
    jwt: {
      expiresInSeconds: 60 * 60 * 24,
      key: ':D',
    }
  },
});
