import { getContext } from "svelte";
import { ApiEndpoints, ApiPrefix, Routes } from "../config";

import { FetchFN, makeScopedFetch, makeSendJSON } from "./requests"

import auth from './auth';
import validation from './validation';
import externalData from './externalData';
import type { NavigateFn } from "svelte-navigator";

export type SharedServicesConfig = Readonly<{
  fetch: FetchFN;
  sendJSON: FetchFN;
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
  externalData: typeof externalData;
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
  externalData: externalData(sharedConfig, specificConfigs.externalData),
})

type DynamicConfig = Readonly<{
  navigate: NavigateFn;
}>


export const SERVICES_KEY = Symbol();

export const getServices = () => getContext<Services>(SERVICES_KEY)

export default ({
  navigate
}: DynamicConfig) => {
  const fetch = makeScopedFetch(ApiPrefix);
  const sendJSON = makeSendJSON(fetch);

  return makeServices({ fetch, sendJSON }, {
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
    externalData: {
      requestEndpoints: {
        measurmentUnits: ApiEndpoints.getMeasurmentUnits,
        pantryItem: ApiEndpoints.pantryItem,
      },
    },
    validation: null,
  })
};
