<script lang="ts">
  import type { Nullable } from "../../utils/types";

  export let label: string;
  export let name: string;
  export let type: string;

  export let placeholder: Nullable<string>;
</script>

<div class="input -full-width">
  <label class="input__label -full-width">
    <div class="-pl--700 -pb--500">
      <span class="text__paragraph--base--heavy">{label}</span>
    </div>
    <input
      {name}
      {type}
      class="input__input -full-width"
      placeholder={`${placeholder ?? label}...`}
    />
  </label>
</div>
