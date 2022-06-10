export type RequestResponse<T> = Readonly<{
  ok: boolean;
  errors: Partial<{
    [key in keyof T]: string
  }>
}>

export type FetchFN = typeof fetch;

export const makeScopedFetch = (fetchInstance: FetchFN, apiPrefix: string): FetchFN => (...args) => {
  const [requestURI, ...other] = args;

  return fetchInstance(`${apiPrefix}${requestURI}`, ...other);
}

export const makeSendJSON = (scopedFetch: FetchFN):  FetchFN => (...args) => {
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
