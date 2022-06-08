import type { Literal } from "./types";

export const isString = (arg: unknown): arg is string => typeof arg === 'string';

export const isNil = (arg: unknown): arg is null | undefined => arg === null || arg === undefined;
export const isNotNil = <T>(arg: T | null | undefined): arg is T => !isNil(arg);

export const isLiteral = <T>(
  arg: unknown,
): arg is (T extends Literal ? T : Literal) => {
  if (typeof arg !== 'object') {
    return false;
  }

  if (isNil(arg)) {
    return false;
  }

  if (Object.getPrototypeOf(arg) === null) {
    return true;
  }

  return Object.getPrototypeOf(Object.getPrototypeOf(arg)) === null;
};

export function isEmpty(arg: string | null | undefined): arg is '' | null | undefined;
export function isEmpty<T>(arg: T | null | undefined): arg is null | undefined;
export function isEmpty<T>(arg: T): boolean {
  if (arg === null || arg === undefined) {
    return true;
  }

  if (isString(arg) && arg.trim() === '') {
    return true;
  }

  if (isLiteral(arg) && Object.keys(arg).length === 0) {
    return true;
  }

  if (Array.isArray(arg) && arg.length === 0) {
    return true;
  }

  return false;
}
