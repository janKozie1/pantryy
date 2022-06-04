<script lang="ts">
  import type { Nullable } from "../../utils/types";
  import InputLabel from "./InputLabel.svelte";

  export let label: Nullable<string> = null;
  export let name: string;
  export let type: string = "text";
  export let error: Nullable<string> = null;
  export let placeholder: Nullable<string> = null;

  export let cls: string = "";
  export let ghost: boolean = false;
</script>

<InputLabel {label} {error}>
  <input
    {name}
    {type}
    class={`input__input -full-width ${
      ghost ? "input__input--ghost -bg--neutral_8" : ""
    } ${cls}`}
    placeholder={`${placeholder ?? label ?? name}...`}
  />
</InputLabel>
