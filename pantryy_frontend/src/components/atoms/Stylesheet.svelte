<script lang="ts">
  export let src: string;
</script>

<svelte:head>
  <link rel="stylesheet" href={`/static/css/${src}`} />
</svelte:head>
