<script lang="ts">
  import { isNil } from "../../utils/guards";

  export let data: unknown;
</script>

{#if !isNil(data)}
  <slot />
{:else}
  <div>not found</div>
{/if}
