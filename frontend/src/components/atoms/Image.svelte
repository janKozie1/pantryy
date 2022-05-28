<script lang="ts">
  export let src: string;
  export let alt: string;
  export let cls: string;
</script>

<img src={`images/${src}`} {alt} class={cls} />
