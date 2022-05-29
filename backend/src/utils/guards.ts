import { Literal } from "./types";

export const isLiteral = <T>(
  arg: unknown,
): arg is (T extends Literal ? T : Literal) => typeof arg === 'object' && (
  Object.getPrototypeOf(Object.getPrototypeOf(arg))
) === null;

export const isObjectWithKeys = <T>(
  arg: unknown,
  requiredKeys: (keyof T)[],
): arg is T => isLiteral(arg) && requiredKeys.every((key) => key in arg);
