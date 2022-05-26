<script lang="ts">
  export let src: string;
</script>

<svelte:head>
  <link rel="stylesheet" href={`/css/${src}`} />
</svelte:head>
