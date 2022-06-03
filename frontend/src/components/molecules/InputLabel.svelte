<script lang="ts">
  import { isNil } from "../../utils/guards";
  import type { Nullable } from "../../utils/types";

  export let label: Nullable<string> = null;
</script>

<div class="input -full-width">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="input__label -full-width">
    {#if !isNil(label)}
      <div class="-pl--700 -pb--500">
        <span class="text__paragraph--base--heavy">{label}</span>
      </div>
    {/if}

    <slot />
  </label>
</div>
