<script lang="ts">
  export let name: string;
  export let label: string;
</script>

<label>
  <input type="radio" {name} class="-mr--200" />
  <span class="text__paragraph--base--regular">{label}</span>
</label>
