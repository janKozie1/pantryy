export type Nullable<T> = T | null | undefined;

export type Literal = Record<string, unknown>;

export type ValidationResponse<T> = Readonly<{
  ok: boolean;
  errors: Partial<{
    [key in keyof T]: Nullable<string>
  }>,
  validData: Nullable<T>;
}>

export type PartialWithNulls<T> = Readonly<{
  [key in keyof T]?: Nullable<T[key]>
}>

export type PartialDeepObject<Obj> = Obj extends Literal | Nullable<Literal> ? {
  [key in keyof Obj]?: PartialDeepObject<Obj[key]>
} : Obj;
