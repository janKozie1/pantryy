import { Pool } from 'pg';
import auth from './auth.js';
import files from './files.js';

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
  files: typeof files;
}>;

type ServiceSpecificConfigs = Readonly<{
  [service in keyof Omit<UninitializedServices, 'operations'>]:  UninitializedServices[service] extends ServiceCreator<infer T, infer Config> ? Config: never;
}>

export type Services = Readonly<{
  [service in keyof UninitializedServices]: ReturnType<UninitializedServices[service]>
}>

const makeServices = (
  sharedConfig: SharedServicesConfig, specificConfigs: ServiceSpecificConfigs
): Services => ({
  auth: auth(sharedConfig, specificConfigs.auth),
  files: files(sharedConfig, specificConfigs.files)
})

type DynamicConfig = Readonly<{
  pool: Pool;
  filesConfig: ServiceSpecificConfigs['files']
}>

export default (dynamicConfig: DynamicConfig) => makeServices({
  pool: dynamicConfig.pool
}, {
  auth: {
    authCookieName: 'auth',
    jwt: {
      expiresInSeconds: 60 * 60 * 24,
      key: ':D',
    }
  },
  files: dynamicConfig.filesConfig
});
