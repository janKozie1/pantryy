import { getContext } from "svelte";
import { ApiEndpoints, ApiPrefix, Routes } from "../config";

import { FetchFN, makeScopedFetch } from "./requests"

import auth from './auth';
import validation from './validation';
import type { NavigateFn } from "svelte-navigator";

export type SharedServicesConfig = Readonly<{
  fetch: FetchFN;
}>

export type ServiceCreator<ServiceShape, Config = null> = (
  sharedServicesConfig: SharedServicesConfig, serviceConfig: Config
) => ServiceShape;

export type MakeServiceFN<Data, ReturnValue = void, ServiceConfig = null> = unknown extends Data
  ? (config: SharedServicesConfig, serviceConfig: ServiceConfig) => () => ReturnValue
  : (config: SharedServicesConfig, serviceConfig: ServiceConfig) => (data: Data) => ReturnValue;

type UninitializedServices = Readonly<{
  auth: typeof auth;
  validation: typeof validation;
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
  validation: validation(sharedConfig, specificConfigs.validation),
})

type DynamicConfig = Readonly<{
  navigate: NavigateFn;
}>


export const SERVICES_KEY = Symbol();

export const getServices = () => getContext<Services>(SERVICES_KEY)

export default ({
  navigate
}: DynamicConfig) => makeServices({ fetch: makeScopedFetch(ApiPrefix) }, {
  auth: {
    authCookieName: 'auth',
    redirect: {
      toLogin: () => navigate(Routes.login),
    },
    requestEndpoints: {
      login: ApiEndpoints.login,
      register: ApiEndpoints.register,
    }
  },
  validation: null,
});
