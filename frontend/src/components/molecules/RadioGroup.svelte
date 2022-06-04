<script lang="ts">
  import type { Nullable } from "../../utils/types";
  import ErrorMessage from "./ErrorMessage.svelte";

  export let label: string;
  export let error: Nullable<string> = null;
</script>

<div class="-full-width">
  <div class="-pl--700 -pb--500">
    <span class="text__paragraph--base--heavy">{label}</span>
  </div>
  <div class="-align-center -gap--700">
    <slot />
  </div>
  <ErrorMessage {error} />
</div>
