<script lang="ts">
  type Variant = "small" | "regular" | "big";
  export let variant: Variant = "regular";
</script>

<div class={`spinner spinner-${variant}`} />
