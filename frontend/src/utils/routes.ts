export type PathParams<T extends string, U = undefined> =
  T extends `${infer A}/:${infer B}/${infer C}`
    ? PathParams<A, Record<B, string>> & PathParams<C, Record<B, string>>
    : T extends `${infer A}/:${infer B}`
      ? PathParams<A, Record<B, string>>
      : U;

type PathParamsWithDefaults<T extends string> = PathParams<T> extends undefined ? Record<string, string> : PathParams<T>;


export const generatePath = <T extends string>(path: T, args: PathParamsWithDefaults<T>): string => {
  const keyValueParams = Object.entries(args);

  return path.split('/').map((part) => {
    const matchingParam = keyValueParams.find(([key]) => part === `:${key}`);

    if (matchingParam) {
      return matchingParam[1];
    }

    return part;
  }).join('/')
}
