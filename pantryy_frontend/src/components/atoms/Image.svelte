<script lang="ts">
  import type { Nullable } from "../../utils/types";

  export let src: string;
  export let alt: string;
  export let cls: Nullable<string> = null;

  export let external: boolean = false;
</script>

<img src={external ? src : `/static/images/${src}`} {alt} class={cls} />
