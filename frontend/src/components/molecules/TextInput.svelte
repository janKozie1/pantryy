<script lang="ts">
  import { isString } from "../../utils/guards";
  import type { Nullable } from "../../utils/types";

  export let label: string;
  export let name: string;
  export let type: string = "text";

  export let error: Nullable<string> = null;

  export let placeholder: Nullable<string> = null;
</script>

<div class="input -full-width">
  <label class="input__label -full-width">
    <div class="-pl--700 -pb--500">
      <span class="text__paragraph--base--heavy">{label}</span>
    </div>
    <input
      {name}
      {type}
      class="input__input -full-width"
      placeholder={`${placeholder ?? label}...`}
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
  </label>
</div>
