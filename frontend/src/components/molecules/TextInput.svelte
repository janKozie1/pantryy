<script lang="ts">
  import { isNil, isString } from "../../utils/guards";
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

<InputLabel {label}>
  <input
    {name}
    {type}
    class={`input__input -full-width ${
      ghost ? "input__input--ghost -bg--neutral_8" : ""
    } ${cls}`}
    placeholder={`${placeholder ?? label ?? name}...`}
  />
  {#if isString(error)}
    <div class="-pl--700 -mt--400 ">
      <span class="text__paragraph--small--regular">
        <span class="-color--state_error">
          {error}
        </span>
      </span>
    </div>
  {/if}
</InputLabel>
