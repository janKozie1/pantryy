<script lang="ts">
  import type { Nullable } from "../../utils/types";

  export let type: Nullable<string> = "button";
  export let cls: Nullable<string> = "";

  type Sizes = "lg" | "md" | "sm";
  type ColorVariants = "primary" | "secondary" | "neutral";
  type FillVariants = "filled" | "ghost" | "borderless";

  export let size: `${Sizes}${"--squared" | ""}`;
  export let fill: FillVariants;
  export let color: ColorVariants;
</script>

<button
  {type}
  class={`${cls} button button--${size} button--${fill}--${color}`}
>
  <span class="text__action--button--large">
    <slot name="content" />
  </span>
  {#if $$slots.icon}
    <div class="-inline-flex -pl--500 -mt--200">
      <slot name="icon" />
    </div>
  {/if}
</button>
