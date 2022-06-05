<script lang="ts">
  import { isNil } from "../../utils/guards";

  export let data: unknown;
  console.log(data);
</script>

{#if !isNil(data)}
  <slot />
{:else}
  <div>not found</div>
{/if}
