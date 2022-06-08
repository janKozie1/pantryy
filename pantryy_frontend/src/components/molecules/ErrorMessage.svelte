<script lang="ts">
  import { isString } from "../../utils/guards";
  import type { Nullable } from "../../utils/types";

  export let error: Nullable<string> = null;
</script>

{#if isString(error)}
  <div class="-pl--700 -mt--400 ">
    <span class="text__paragraph--small--regular">
      <span class="-color--state_error">
        {error}
      </span>
    </span>
  </div>
{/if}
