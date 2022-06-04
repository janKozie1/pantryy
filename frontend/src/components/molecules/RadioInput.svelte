<script lang="ts">
  export let name: string;
  export let label: string;
  export let value: string;
</script>

<label>
  <input type="radio" {name} {value} class="-mr--200" />
  <span class="text__paragraph--base--regular">{label}</span>
</label>
