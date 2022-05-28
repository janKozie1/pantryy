export type FetchFN = typeof fetch;

export const makeScopedFetch = (apiPrefix: string): FetchFN => (...args) => {
  const [requestURI, ...other] = args;

  return fetch(`${apiPrefix}${requestURI}`, ...other);
}
