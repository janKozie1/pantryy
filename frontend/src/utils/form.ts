import { isNil } from "./guards";
import type { Nullable } from "./types";

export type OnSubmitFN = (arg: FormData) => void;
type SubmitEvent = Event & { currentTarget: EventTarget & HTMLFormElement; };

export const withFormData = (fn: OnSubmitFN) => (e: SubmitEvent) => {
  const target = e.target;

  if (target instanceof HTMLFormElement) {
    fn(new FormData(target));
  }
}

type FieldErrors = Record<string, Nullable<string>>;

export const mergeFieldErrors = <Errors extends FieldErrors>(current: Errors, newErrors: Partial<Errors>): Errors => {
  if (isNil(newErrors)) {
    return Object.fromEntries(Object.entries(current).map(([errorName]) => [errorName, null])) as Errors;
  }

  return {
    ...current,
    ...newErrors,
  }
}
