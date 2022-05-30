type OnSubmitFN = (arg: FormData) => void;
type SubmitEvent = Event & { currentTarget: EventTarget & HTMLFormElement; };

export const withFormData = (fn: OnSubmitFN) => (e: SubmitEvent) => {
  const target = e.target;

  if (target instanceof HTMLFormElement) {
    fn(new FormData(target));
  }
}
