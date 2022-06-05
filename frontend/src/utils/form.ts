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


export const setInitialValues = (ref: HTMLElement, initialValues: Partial<Record<string, string>>) => {
  const inputValues = Object.entries(initialValues);

  inputValues.forEach(([inputName, value]) => {
    const selector = `[name="${inputName}"]`;
    const input = ref.querySelector(selector);

    if (isNil(input)) {
      return;
    }

    if (input instanceof HTMLInputElement) {
      if (input.type === 'radio') {
        ([...ref.querySelectorAll(selector)] as HTMLInputElement[]).forEach((radio) => {
          if (radio.value === value) {
            radio.checked = true;
          } else {
            radio.checked = false;
          }
        });
      } else {
        input.value = value;
      }
    }

    if (input instanceof HTMLTextAreaElement) {
      input.value = value;
    }
  })
}
