export type Nullable<T> = T | null | undefined;

export type Literal = Record<string, unknown>;

export type ValidationResponse<T> = Readonly<{
  ok: boolean;
  errors: Partial<{
    [key in keyof T]: Nullable<string>
  }>,
  validData: Nullable<T>;
}>
