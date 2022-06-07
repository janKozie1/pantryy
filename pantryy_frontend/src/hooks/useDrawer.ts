import { Readable, writable } from "svelte/store";

type UseDrawerArg = Readonly<{
  onSuccess: () => void;
}>;

type UseDrawerReturnValue = Readonly<{
  isOpen: Readable<boolean>
  onOpen: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}>

export const useDrawer = ({onSuccess: onSuccessCB}: UseDrawerArg): UseDrawerReturnValue => {
  const { subscribe, update } = writable(false);

  let onOpen = () => update(() => true);
  let onCancel = () => update(() => false);
  let onSuccess = () => {
    update(() => false)
    onSuccessCB();
  };

  return  {
    isOpen: {subscribe},
    onCancel,
    onOpen,
    onSuccess
  }
}
