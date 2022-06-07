<script lang="ts">
  import TextInput from "../molecules/TextInput.svelte";
</script>

<div class="toolbar -py--700 -my--400 -px--1000">
  <form>
    <TextInput name="search" placeholder="Search" ghost />
  </form>
  <slot />
</div>
<div class="divider--horizontal -full-width" />
